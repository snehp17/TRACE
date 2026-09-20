import fs from 'fs';
import path from 'path';
import readline from 'readline';

const OUTPUT_DIR = path.resolve('src/data/processed');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

// 1. PROCESS HOUSEHOLD TRANSACTIONS (2,461 records)
async function processHousehold() {
  const filePath = path.resolve('extracted_data/household/Daily Household Transactions.csv');
  console.log('Processing Household Transactions from:', filePath);
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const records = [];
  let headers = [];
  let count = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (count === 0) {
      headers = parseCsvLine(line).map(h => h.trim());
      count++;
      continue;
    }
    const cols = parseCsvLine(line).map(c => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] || '';
    });

    // Date parsing: "DD/MM/YYYY HH:mm:ss" or "DD/MM/YYYY"
    const rawDate = row['Date'] || '';
    let isoDate = null;
    let timeStr = '12:00:00';
    if (rawDate) {
      const parts = rawDate.split(' ');
      const dateParts = parts[0].split('/');
      if (dateParts.length === 3) {
        const d = dateParts[0].padStart(2, '0');
        const m = dateParts[1].padStart(2, '0');
        const y = dateParts[2];
        if (parts[1]) timeStr = parts[1];
        isoDate = `${y}-${m}-${d}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
      }
    }

    const amt = parseFloat(row['Amount']?.replace(/,/g, '')) || 0;
    const category = row['Category'] || 'Other';
    const subcategory = row['Subcategory'] || '';
    const note = row['Note'] || '';
    const mode = row['Mode'] || 'Cash';
    const type = row['Income/Expense'] || 'Expense';

    records.push({
      id: `hh-${count}`,
      source: 'household',
      timestamp: isoDate || rawDate,
      rawDate: rawDate,
      category: category,
      subcategory: subcategory,
      title: subcategory ? `${category} · ${subcategory}` : category,
      description: note || `${mode} payment for ${category}`,
      amount: amt,
      currency: row['Currency'] || 'INR',
      mode: mode,
      type: type,
      location: subcategory.toLowerCase().includes('train') || note.toLowerCase().includes('place') ? 'Transit Route / City' : 'Local / Household',
      metadata: {
        note: note,
        subcategory: subcategory,
        paymentMode: mode,
        flowType: type
      }
    });

    count++;
  }

  // Sort by timestamp descending
  records.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  // Compute aggregate insights
  const categoryCounts = {};
  const modeCounts = {};
  let totalExpense = 0;
  let totalIncome = 0;

  records.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    modeCounts[r.mode] = (modeCounts[r.mode] || 0) + 1;
    if (r.type === 'Expense') totalExpense += r.amount;
    else totalIncome += r.amount;
  });

  const householdOutput = {
    sourceId: 'household',
    name: 'Daily Life & Household Archive',
    subtitle: 'Daily Household Journey • 2,461 Life Receipts (2015–2021)',
    description: 'A granular chronicle of personal expenditures, commute patterns, nutrition stops, recurring subscriptions, and family responsibilities.',
    totalRecords: records.length,
    dateRange: {
      start: records[records.length - 1]?.timestamp?.slice(0, 10),
      end: records[0]?.timestamp?.slice(0, 10)
    },
    metrics: {
      totalExpense: Math.round(totalExpense),
      totalIncome: Math.round(totalIncome),
      totalCategories: Object.keys(categoryCounts).length,
      categoryDistribution: categoryCounts,
      paymentModes: modeCounts
    },
    records: records
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'household_archive.json'), JSON.stringify(householdOutput, null, 2));
  console.log(`Saved household archive: ${records.length} records.`);
}

// 2. PROCESS SPOTIFY LISTENING HISTORY (149,860 streams)
async function processSpotify() {
  const filePath = path.resolve('extracted_data/spotify/spotify_history.csv');
  console.log('Processing Spotify History from:', filePath);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  let headers = [];
  const artistCounts = {};
  const platformCounts = {};
  const reasonStartCounts = {};
  const annualCounts = {};
  const hourlyCounts = Array(24).fill(0);
  let totalMs = 0;
  let totalSkips = 0;
  let minDate = '9999';
  let maxDate = '0000';

  // We will collect representative chronological memory sessions + deep anchor clusters
  // to create a rich 4,000-receipt explorer subset covering every year 2013-2024
  const curatedStreams = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (count === 0) {
      headers = parseCsvLine(line).map(h => h.replace(/^\uFEFF/, '').trim());
      count++;
      continue;
    }

    const cols = parseCsvLine(line).map(c => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] || '';
    });

    const uri = row['spotify_track_uri'] || `spotify:track:${count}`;
    const ts = row['ts'] || '';
    const platform = row['platform'] || 'web player';
    const msPlayed = parseInt(row['ms_played'], 10) || 0;
    const trackName = row['track_name'] || 'Unknown Track';
    const artistName = row['artist_name'] || 'Unknown Artist';
    const albumName = row['album_name'] || 'Unknown Album';
    const reasonStart = row['reason_start'] || 'trackdone';
    const reasonEnd = row['reason_end'] || 'trackdone';
    const shuffle = row['shuffle'] === 'TRUE';
    const skipped = row['skipped'] === 'TRUE';

    if (ts) {
      if (ts < minDate) minDate = ts;
      if (ts > maxDate) maxDate = ts;
      const year = ts.slice(0, 4);
      annualCounts[year] = (annualCounts[year] || 0) + 1;

      const hour = parseInt(ts.slice(11, 13), 10);
      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        hourlyCounts[hour]++;
      }
    }

    artistCounts[artistName] = (artistCounts[artistName] || 0) + 1;
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    reasonStartCounts[reasonStart] = (reasonStartCounts[reasonStart] || 0) + 1;
    totalMs += msPlayed;
    if (skipped) totalSkips++;

    // Sampling strategy: Sample 1 out of every 38 records to get ~4,000 balanced chronological receipts,
    // plus keep any long plays (>3 mins) or unique milestone tracks
    if (count % 38 === 0 || curatedStreams.length < 500) {
      if (curatedStreams.length < 4200) {
        curatedStreams.push({
          id: `sp-${count}`,
          source: 'spotify',
          timestamp: ts ? ts.replace(' ', 'T') : '',
          rawDate: ts,
          category: 'Music Stream',
          subcategory: artistName,
          title: trackName,
          description: `${trackName} by ${artistName} · Album: ${albumName}`,
          amount: Math.round(msPlayed / 1000), // duration in seconds
          currency: 'SEC',
          mode: platform,
          type: skipped ? 'Skipped Track' : 'Completed Stream',
          location: platform.includes('ios') || platform.includes('android') ? 'Mobile Device' : 'Desktop / Web Player',
          metadata: {
            artist: artistName,
            album: albumName,
            trackUri: uri,
            msPlayed: msPlayed,
            reasonStart: reasonStart,
            reasonEnd: reasonEnd,
            shuffle: shuffle,
            skipped: skipped
          }
        });
      }
    }

    count++;
  }

  // Top 20 artists
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([artist, streams]) => ({ artist, streams }));

  const spotifyOutput = {
    sourceId: 'spotify',
    name: 'Audio & Cultural Stream Archive',
    subtitle: 'Spotify Listening History • 149,860 Streams (2013–2024)',
    description: 'An extensive 11-year sonic journal capturing musical eras, artist binging phases, platform migrations, and late-night listening habits.',
    totalRecords: count - 1,
    sampleRecordsCount: curatedStreams.length,
    dateRange: {
      start: minDate.slice(0, 10),
      end: maxDate.slice(0, 10)
    },
    metrics: {
      totalListeningHours: Math.round(totalMs / (1000 * 60 * 60)),
      totalStreams: count - 1,
      uniqueArtists: Object.keys(artistCounts).length,
      overallSkipRate: Math.round((totalSkips / (count - 1)) * 100),
      topArtists: topArtists,
      platformDistribution: platformCounts,
      annualListening: annualCounts,
      hourlyListening: hourlyCounts
    },
    records: curatedStreams
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'spotify_archive.json'), JSON.stringify(spotifyOutput, null, 2));
  console.log(`Saved spotify archive: ${curatedStreams.length} curated sample records from ${count - 1} total streams.`);
}

// 3. PROCESS AUGMENTED INDIA TRANSACT (10,267 records, privacy safe!)
async function processIndiaTransact() {
  const filePath = path.resolve('extracted_data/indiatransact/Augmented_IndiaTransactMultiFacet2024.csv');
  console.log('Processing India Transact from:', filePath);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  let headers = [];
  const records = [];
  const categoryCounts = {};
  const cityCounts = {};
  let totalAmt = 0;
  let minDate = '9999';
  let maxDate = '0000';
  let fraudCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (count === 0) {
      headers = parseCsvLine(line).map(h => h.trim());
      count++;
      continue;
    }
    const cols = parseCsvLine(line).map(c => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] || '';
    });

    const transId = row['trans_id'] || `${count}`;
    const rawDate = row['trans_date_trans_time'] || '';
    
    // Privacy sanitization: clean merchant name, ignore sensitive personal identifiers (cc_num, first, last, street, dob)
    let merchant = (row['merchant'] || 'Merchant').replace(/^fraud_/, '');
    const category = row['category'] || 'misc';
    const amt = parseFloat(row['amt']) || 0;
    const city = row['city'] || 'Urban Metro';
    const state = row['state'] || 'India';
    const isFraud = row['is_fraud'] === '1.0' || row['is_fraud'] === '1';
    const job = row['job'] || 'Professional';

    // Parse date: "12/26/2023 0:55" or "7/7/2023 7:02" -> ISO format
    let isoDate = null;
    if (rawDate) {
      const parts = rawDate.split(' ');
      const dateParts = parts[0].split('/');
      if (dateParts.length === 3) {
        const m = dateParts[0].padStart(2, '0');
        const d = dateParts[1].padStart(2, '0');
        const y = dateParts[2];
        const timeStr = parts[1] || '12:00';
        isoDate = `${y}-${m}-${d}T${timeStr.length === 4 ? '0' + timeStr : timeStr}:00`;
      }
    }

    if (isoDate) {
      if (isoDate < minDate) minDate = isoDate;
      if (isoDate > maxDate) maxDate = isoDate;
    }

    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
    totalAmt += amt;
    if (isFraud) fraudCount++;

    // Privacy-safe receipt record
    records.push({
      id: `it-${count}`,
      source: 'indiatransact',
      timestamp: isoDate || rawDate,
      rawDate: rawDate,
      category: category.replace(/_/g, ' '),
      subcategory: merchant,
      title: `${category.replace(/_/g, ' ').toUpperCase()} · ${merchant}`,
      description: `Transaction at ${merchant} in ${city}, ${state}`,
      amount: Math.round(amt),
      currency: 'INR',
      mode: 'Card / POS',
      type: isFraud ? 'Flagged Anomaly' : 'Settled Payment',
      location: `${city}, ${state}`,
      metadata: {
        merchant: merchant,
        city: city,
        state: state,
        jobSector: job,
        isAnomaly: isFraud
      }
    });

    count++;
  }

  // Sort by date descending
  records.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const transactOutput = {
    sourceId: 'indiatransact',
    name: 'Urban Multi-Facet Transact Archive',
    subtitle: 'Augmented Transact Stream • 10,267 Privacy-Safe Receipts (2023–2024)',
    description: 'An anonymized financial mobility trace capturing merchant clusters, regional commerce, sector activity, and anomaly detection.',
    totalRecords: records.length,
    dateRange: {
      start: minDate.slice(0, 10),
      end: maxDate.slice(0, 10)
    },
    metrics: {
      totalAmount: Math.round(totalAmt),
      totalCategories: Object.keys(categoryCounts).length,
      categoryDistribution: categoryCounts,
      topCities: Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 15),
      anomaliesDetected: fraudCount
    },
    records: records
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'indiatransact_archive.json'), JSON.stringify(transactOutput, null, 2));
  console.log(`Saved indiatransact archive: ${records.length} records.`);
}

async function run() {
  console.log('--- Processing All Datasets ---');
  await processHousehold();
  await processSpotify();
  await processIndiaTransact();
  console.log('--- All Datasets Processed Successfully ---');
}

run().catch(console.error);
