let cache = null
let loadingPromise = null

export async function getTrainData() {
  if (cache) return cache

  if (loadingPromise) return loadingPromise

  loadingPromise = fetch('/trainData.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load train data')
      return res.json()
    })
    .then((data) => {
      cache = data
      loadingPromise = null
      return cache
    })

  return loadingPromise
}

export function isDataLoaded() {
  return cache !== null
}
