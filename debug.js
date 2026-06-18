const blob = new Blob([Buffer.from('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64')], { type: 'image/gif' });
const formData = new FormData();
formData.append('images', blob, 'test.gif');

fetch('https://odds-lens-client.vercel.app/api/analyze', {
  method: 'POST',
  body: formData,
})
.then(async res => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response Body:', text);
})
.catch(console.error);
