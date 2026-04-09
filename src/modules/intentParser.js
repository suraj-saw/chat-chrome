
const INTENTS = {
  TRAIN_DETAILS: 'TRAIN_DETAILS',
  STATION_TRAINS: 'STATION_TRAINS',
  BETWEEN_STATIONS: 'BETWEEN_STATIONS',
  TRAIN_AT_STATION: 'TRAIN_AT_STATION',
  FIND_TRAIN_NAME: 'FIND_TRAIN_NAME',
  DATASET_STATS: 'DATASET_STATS',
  GREET: 'GREET',
  HELP: 'HELP',
  GENERAL: 'GENERAL',
}

export { INTENTS }

/**
 * Parse a user message into an intent + params.
 * @param {string} input
 * @returns {{ type: string, params: object }}
 */
export function parseIntent(input) {
  const raw = input.trim()
  const lower = raw.toLowerCase()

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|good\s*(morning|evening|afternoon)|namaste)\b/.test(lower)) {
    return { type: INTENTS.GREET, params: {} }
  }

  // ── Help ───────────────────────────────────────────────────────────────────
  if (/\b(help|what can you|features|commands|how to use)\b/.test(lower)) {
    return { type: INTENTS.HELP, params: {} }
  }

  // ── Dataset stats ──────────────────────────────────────────────────────────
  if (/\b(stats|statistics|how many trains|total trains|total stations|dataset)\b/.test(lower)) {
    return { type: INTENTS.DATASET_STATS, params: {} }
  }

  // ── Train at station: "when does train X arrive at Y" ─────────────────────
  const trainAtStation = raw.match(
    /(?:when|time|schedule|arrival|departure).*?train\s+([a-z0-9 ]+?)\s+(?:at|reach|reaches|arrive|arrive at|depart from|stop at)\s+(.+)/i
  ) || raw.match(
    /train\s+([a-z0-9 ]+?)\s+(?:at|reach|reaches|arrive at|depart from|stop at|timing at)\s+(.+)/i
  )
  if (trainAtStation) {
    return {
      type: INTENTS.TRAIN_AT_STATION,
      params: { trainQuery: trainAtStation[1].trim(), stationQuery: trainAtStation[2].trim() },
    }
  }

  // ── Between stations: "trains from X to Y" ────────────────────────────────
  const between = raw.match(
    /(?:trains?|travel|go|route|journey)\s+(?:from|between)\s+(.+?)\s+(?:to|and)\s+(.+)/i
  ) || raw.match(/from\s+(.+?)\s+to\s+(.+)/i)
  if (between) {
    return {
      type: INTENTS.BETWEEN_STATIONS,
      params: { fromQuery: between[1].trim(), toQuery: between[2].trim() },
    }
  }

  // ── Station trains: "trains at/in/through STATION" ────────────────────────
  const stationTrains = raw.match(
    /(?:trains?|schedule)\s+(?:at|in|through|via|passing through|stopping at|from)\s+(.+)/i
  ) || raw.match(
    /(?:which trains|all trains|list trains)\s+(?:stop at|pass through|visit)\s+(.+)/i
  )
  if (stationTrains) {
    return {
      type: INTENTS.STATION_TRAINS,
      params: { stationQuery: stationTrains[1].trim() },
    }
  }

  // ── Train details by number (pure digits or "train 12345") ────────────────
  const trainNumber = raw.match(/(?:train(?:\s+no\.?|number|#)?\s*)(\d{3,5})\b/i)
  if (trainNumber) {
    return {
      type: INTENTS.TRAIN_DETAILS,
      params: { trainNo: trainNumber[1] },
    }
  }

  // ── Bare number query ──────────────────────────────────────────────────────
  if (/^\d{3,5}$/.test(raw)) {
    return { type: INTENTS.TRAIN_DETAILS, params: { trainNo: raw } }
  }

  // ── Find train by name/keyword ─────────────────────────────────────────────
  const findTrain = raw.match(
    /(?:find|search|look up|info about|details of|tell me about)\s+(?:train\s+)?(.+)/i
  )
  if (findTrain) {
    return {
      type: INTENTS.FIND_TRAIN_NAME,
      params: { query: findTrain[1].trim() },
    }
  }

  return { type: INTENTS.GENERAL, params: { raw } }
}
