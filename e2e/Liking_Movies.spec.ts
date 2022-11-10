const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
    I.amOnPage('/#/like');
});
   
Scenario('showing empty liked movies', ({ I }) => {
  I.seeElement('#query');
  I.waitForElement('.movie-item__not__found', 30);
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});

Scenario('liking one movie', async ({ I }) => {
  I.waitForElement('.movie-item__not__found', 30);
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
  
  I.amOnPage('/');
  I.waitForElement('.movie__title a', 30);
  const firstFilm = locate('.movie__title a').first();
  const firstFilmTitle = await I.grabTextFrom(firstFilm);
  I.click(firstFilm);
  
  I.waitForElement('#likeButton', 30);
  I.click('#likeButton');

  I.amOnPage('/#/like');
  I.waitForElement('.movie-item', 30);
  const likedFilmTitle = await I.grabTextFrom('.movie__title');

  assert.strictEqual(firstFilmTitle, likedFilmTitle);
});

Scenario('searching movies', async ({ I }) => {
  I.waitForElement('.movie-item__not__found', 30);
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
  
  I.amOnPage('/');
  I.waitForElement('.movie__title a', 30);

  const titles = []; // menampung 3 title yang akan di like
  for (let i = 1; i <= 3; i++) {
    I.click(locate('.movie__title a').at(i));
    I.waitForElement('#likeButton', 30);
    I.click('#likeButton');
    titles.push(await I.grabTextFrom('.movie__title'));
    I.amOnPage('/');
  }

  I.amOnPage('/#/like');
  I.waitForElement('#query', 30);

  const searchQuery = titles[1].substring(1, 3);
  const matchingMovies = titles.filter((title) => title.indexOf(searchQuery) !== -1); 
  I.fillField('#query', searchQuery);
  I.pressKey('Enter');

  const visibleLikedMovies = await I.grabNumberOfVisibleElements('.movie-item'); //untuk melihat jumlah movie yang telah di filter berdasarkan keyword
  assert.strictEqual(matchingMovies.length, visibleLikedMovies);
   
  matchingMovies.forEach(async (title, index) => {
    const visibleTitle = await I.grabTextFrom(locate('.movie__title').at(index + 1));
    assert.strictEqual(title, visibleTitle);
  });
})