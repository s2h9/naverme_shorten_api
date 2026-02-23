## 사용법
GET 
```text
/shorten?url={urlParameter}
```

Response

```json
{"success":true,"shortenUrl":"https://naver.me/${hash}","raw":{"result":{"hash":"${hash}","url":"https://naver.me/${hash}","orgUrl":"https://link.naver.com/bridge?url=${shortenUrl}","httpsUrl":"https://naver.me/${hash}"},"code":"200","message":"ok"}}
```
