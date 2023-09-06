export function readStreamTextByBodyReader(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  readCallback?: (value: any) => void,
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
    if (readCallback) {
      const decoder = new TextDecoder();
      readCallback(decoder.decode(value));
    }

    // 다음 stream 호출
    readStreamTextByBodyReader(reader, readCallback, doneCallback);
  });
}
