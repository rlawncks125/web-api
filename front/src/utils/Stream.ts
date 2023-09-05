export function readTextByBodyReader(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  callback?: (value: any) => void,
  doneCallback?: () => void
) {
  if (!reader) return;

  reader.read().then(({ done, value }) => {
    // 더이상 처리할 데이터가 없다
    if (done) {
      doneCallback && doneCallback();
      return;
    }

    // 처리
    if (callback) {
      const decoder = new TextDecoder();
      callback(decoder.decode(value));
    }

    // 다음 stream 호출
    readTextByBodyReader(reader, callback, doneCallback);
  });
}
