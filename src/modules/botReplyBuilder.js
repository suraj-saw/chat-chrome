
import { INTENTS } from './intentParser.js'
import {
  findTrainsByName,
  getTrainDetails,
  findTrainsByStation,
  findTrainsBetweenStations,
  getTrainAtStation,
  getDatasetStats,
} from './trainQueryEngine.js'

const HELP_TEXT = `I'm the **Indian Railways Chatbot** — trained on real schedule data with **11,000+ trains** and **8,000+ stations**.

Here's what I can help you with:

- **Train details by number** — "train 12345" or just "12345"
- **Find trains by name** — "find Rajdhani" or "search Shatabdi"
- **Trains at a station** — "trains at NDLS" or "trains at New Delhi"
- **Trains between two stations** — "trains from Mumbai to Delhi"
- **Train schedule at a station** — "when does train 12301 arrive at NDLS"
- **Dataset statistics** — "show stats"

*Use station codes (like NDLS, CSTM) or partial names.*`

/**
 * Build a bot reply from a parsed intent + loaded data.
 * @param {{ type: string, params: object }} intent
 * @param {object|null} data - loaded train data, or null if still loading
 * @returns {string} markdown reply
 */
export function buildReply(intent, data) {
  if (!data) {
    return 'Train data is still loading… Please try again in a moment.'
  }

  switch (intent.type) {
    case INTENTS.GREET:
      return `Hello! I'm your Indian Railways assistant.\n\nAsk me about trains, stations, schedules, or routes. Type **help** to see what I can do!`

    case INTENTS.HELP:
      return HELP_TEXT

    case INTENTS.DATASET_STATS:
      return getDatasetStats(data)

    case INTENTS.TRAIN_DETAILS:
      return getTrainDetails(data, intent.params.trainNo)

    case INTENTS.FIND_TRAIN_NAME:
      return findTrainsByName(data, intent.params.query)

    case INTENTS.STATION_TRAINS:
      return findTrainsByStation(data, intent.params.stationQuery)

    case INTENTS.BETWEEN_STATIONS:
      return findTrainsBetweenStations(
        data,
        intent.params.fromQuery,
        intent.params.toQuery
      )

    case INTENTS.TRAIN_AT_STATION:
      return getTrainAtStation(
        data,
        intent.params.trainQuery,
        intent.params.stationQuery
      )

    case INTENTS.GENERAL:
    default:
      return buildGeneralReply(intent.params.raw ?? '')
  }
}

function buildGeneralReply(input) {
  const lower = input.toLowerCase()

  if (/(who are you|what are you|your name)/.test(lower)) {
    return `I'm the **Indian Railways Chatbot** — I can answer questions about train schedules, routes, and station information.\n\nType **help** to see all commands.`
  }

  if (/(thank|thanks|thx)/.test(lower)) {
    return `You're welcome! Let me know if you have more questions about trains.`
  }

  if (/(bye|goodbye|see you)/.test(lower)) {
    return `Safe travels! Come back whenever you need train info.`
  }

  return (
    `I didn't quite understand that. I specialise in **Indian Railways** queries.\n\n` +
    `Try:\n- "trains from Delhi to Mumbai"\n- "train 12301"\n- "trains at NDLS"\n- Type **help** for all options`
  )
}
