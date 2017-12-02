if (process.NODE_ENV === 'production') {
  console.log('running analytics.js...');
  const gaTagManager = document.createElement('script');
  gaTagManager.async = true;
  gaTagManager.src = 'https://www.googletagmanager.com/gtag/js?id=UA-45222428-7';
  document.body.appendChild(gaTagManager);
  console.log(gaTagManager);

  const analytics = document.createElement('script');
  analytics.text = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-45222428-7');
`;
  document.body.appendChild(analytics);
}
