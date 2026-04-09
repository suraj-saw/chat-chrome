
// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(t) {
  if (!t || t === '00:00:00') return '–'
  return t.slice(0, 5) // "HH:MM"
}

function normalize(str) {
  return str?.toLowerCase().trim() ?? ''
}

function matchesStation(query, code, name) {
  const q = normalize(query)
  return normalize(code).includes(q) || normalize(name).includes(q)
}

function matchesTrain(query, number, name) {
  const q = normalize(query)
  return normalize(number) === q || normalize(name).includes(q)
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Find trains by number or partial name.
 */
export function findTrainsByName(data, query) {
  const results = Object.values(data.trains).filter((t) =>
    matchesTrain(query, t.number, t.name)
  )

  if (!results.length)
    return `No trains found matching **"${query}"**. Try a train number or partial name.`

  if (results.length === 1) {
    return formatTrainDetails(results[0])
  }

  const lines = results.slice(0, 10).map(
    (t) =>
      `- **${t.number}** — ${t.name} (${t.sourceName} → ${t.destinationName})`
  )
  const extra = results.length > 10 ? `\n…and ${results.length - 10} more.` : ''
  return `Found **${results.length}** train(s) matching **"${query}"**:\n\n${lines.join('\n')}${extra}`
}

/**
 * Get full details + stops for a specific train number.
 */
export function getTrainDetails(data, trainNo) {
  const train = data.trains[trainNo]
  if (!train) return `Train **${trainNo}** not found. Please check the number.`
  return formatTrainDetails(train)
}

function formatTrainDetails(train) {
  const header = `## Train ${train.number} — ${train.name}\n**From:** ${train.sourceName} (${train.source})  →  **To:** ${train.destinationName} (${train.destination})\n**Total stops:** ${train.stops.length}`

  const stopTable = [
    '\n| # | Station | Code | Arrival | Departure | Dist (km) |',
    '|---|---------|------|---------|-----------|-----------|',
    ...train.stops.map(
      (s) =>
        `| ${s.seq} | ${s.name} | ${s.code} | ${formatTime(s.arrival)} | ${formatTime(s.departure)} | ${s.distance} |`
    ),
  ].join('\n')

  return `${header}\n${stopTable}`
}

/**
 * Find all trains passing through a given station (code or partial name).
 */
export function findTrainsByStation(data, stationQuery) {
  // Resolve station code
  const matchedCodes = Object.entries(data.stations)
    .filter(([code, name]) => matchesStation(stationQuery, code, name))
    .map(([code]) => code)

  if (!matchedCodes.length)
    return `No station found matching **"${stationQuery}"**.`

  const primaryCode = matchedCodes[0]
  const stationName = data.stations[primaryCode] ?? primaryCode

  const trainNos = data.stationTrains[primaryCode] ?? []
  if (!trainNos.length)
    return `No trains found passing through **${stationName}** (${primaryCode}).`

  const trains = trainNos
    .map((no) => data.trains[no])
    .filter(Boolean)
    .slice(0, 15)

  const lines = trains.map((t) => {
    const stop = t.stops.find((s) => s.code === primaryCode)
    const time = stop ? `arr ${formatTime(stop.arrival)} / dep ${formatTime(stop.departure)}` : ''
    return `- **${t.number}** ${t.name} (${t.sourceName} → ${t.destinationName}) ${time}`
  })

  const extra =
    trainNos.length > 15 ? `\n…and ${trainNos.length - 15} more trains.` : ''

  return `**${trainNos.length}** train(s) pass through **${stationName}** (${primaryCode}):\n\n${lines.join('\n')}${extra}`
}

/**
 * Find trains running between two stations.
 */
export function findTrainsBetweenStations(data, fromQuery, toQuery) {
  // Resolve station codes
  const fromCodes = Object.entries(data.stations)
    .filter(([c, n]) => matchesStation(fromQuery, c, n))
    .map(([c]) => c)

  const toCodes = Object.entries(data.stations)
    .filter(([c, n]) => matchesStation(toQuery, c, n))
    .map(([c]) => c)

  if (!fromCodes.length) return `Could not find station **"${fromQuery}"**.`
  if (!toCodes.length) return `Could not find station **"${toQuery}"**.`

  const fromCode = fromCodes[0]
  const toCode = toCodes[0]
  const fromName = data.stations[fromCode]
  const toName = data.stations[toCode]

  const fromTrains = new Set(data.stationTrains[fromCode] ?? [])
  const toTrains = new Set(data.stationTrains[toCode] ?? [])

  // Trains that stop at both, in correct order
  const results = []
  for (const no of fromTrains) {
    if (!toTrains.has(no)) continue
    const train = data.trains[no]
    if (!train) continue

    const fromStop = train.stops.find((s) => s.code === fromCode)
    const toStop = train.stops.find((s) => s.code === toCode)
    if (!fromStop || !toStop) continue

    if (parseInt(fromStop.seq) < parseInt(toStop.seq)) {
      results.push({ train, fromStop, toStop })
    }
  }

  if (!results.length)
    return `No direct trains found from **${fromName}** to **${toName}**.`

  const lines = results.slice(0, 15).map(({ train, fromStop, toStop }) => {
    const dep = formatTime(fromStop.departure)
    const arr = formatTime(toStop.arrival)
    const dist = toStop.distance && fromStop.distance
      ? `${parseInt(toStop.distance) - parseInt(fromStop.distance)} km`
      : ''
    return `- **${train.number}** ${train.name} | Dep ${dep} → Arr ${arr} ${dist}`
  })

  const extra = results.length > 15 ? `\n…and ${results.length - 15} more.` : ''

  return `**${results.length}** train(s) from **${fromName}** to **${toName}**:\n\n${lines.join('\n')}${extra}`
}

/**
 * Get the schedule (arrival/departure) of a specific train at a station.
 */
export function getTrainAtStation(data, trainQuery, stationQuery) {
  // Find train
  const train =
    data.trains[trainQuery] ??
    Object.values(data.trains).find((t) => matchesTrain(trainQuery, t.number, t.name))

  if (!train)
    return `Train **"${trainQuery}"** not found.`

  const stop = train.stops.find((s) => matchesStation(stationQuery, s.code, s.name))

  if (!stop)
    return `Train **${train.number} ${train.name}** does not stop at **"${stationQuery}"**.`

  return (
    `**Train ${train.number} — ${train.name}** at **${stop.name}** (${stop.code}):\n` +
    `- Arrival: **${formatTime(stop.arrival)}**\n` +
    `- Departure: **${formatTime(stop.departure)}**\n` +
    `- Distance from source: **${stop.distance} km**\n` +
    `- Stop sequence: **${stop.seq}** of ${train.stops.length}`
  )
}

/**
 * General stats about the dataset.
 */
export function getDatasetStats(data) {
  const trainCount = Object.keys(data.trains).length
  const stationCount = Object.keys(data.stations).length
  return (
    `**Indian Railways Dataset Stats:**\n` +
    `- Total trains: **${trainCount.toLocaleString()}**\n` +
    `- Total stations: **${stationCount.toLocaleString()}**`
  )
}
