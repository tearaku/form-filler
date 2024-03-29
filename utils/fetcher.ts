class FetchError extends Error {
  status: number | undefined
}

export const profileFetcher = (url, pList, eventId?) => fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    method: "GET",
    reqResource: pList,
    eventId: eventId,
  })
}).then(res => {
  if (!res.ok) {
    const err = new FetchError("404 Not found")
    err.status = res.status
    return err
  }
  return res.json()
})


export const minProfileFetcher = (url, mpList, eventId?) => fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    method: "GET",
    reqResource: mpList,
    eventId: eventId,
  })
}).then(res => {
  if (!res.ok) {
    const err = new FetchError("404 Not found")
    err.status = res.status
    return err
  }
  return res.json()
})
