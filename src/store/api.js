import Papa from 'papaparse';
export function fetchCsvData(filePath) {
    return fetch(filePath)
      .then(res => res.text())
      .then(res => Papa.parse(res, {
                  header: true,
                  dynamicTyping: true
                }).data)
      .catch(e => console.error(e));
}