const myKey = 'b1ba471fd7becebe341deb23cf584383';
const submit = document.querySelector('.search__submit');
const imgBox = document.querySelector('.imgBox');
const inputData = document.querySelector('.search__input');
//aside 開關元素宣告
const wrapperBlock = document.querySelector('.wrapper');
const asideBlock = document.querySelector('.aside');
const openBtn = document.querySelector('.wrapper__btn--open');
//渲染元素宣告
const items = document.querySelector('.aside__items');
const header = document.querySelector('.header');
const themeBgc = document.querySelector('.theme__imgBox');
const prev = document.querySelector('.footer__prev');
const next = document.querySelector('.footer__next');
const footer = document.querySelector('.footer');

//search and get API
submit.addEventListener('click', () => {
  let search = inputData.value;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${myKey}&query=${search}`;
  const imageUrl = 'https://image.tmdb.org/t/p/original';
  asideBlock.scrollTo(0, 0);
  footer.classList.contains('hidden') && footer.classList.remove('hidden');

  async function getMovieApi() {
    try {
      let d = await fetch(url);
      let dj = await d.json();
      let results = dj.results;
      let movieInfo = results.map((item, index) => {
        return {
          number: index + 1,
          id: item.id,
          name: item.original_title,
          date: item.release_date,
          popularity: item.popularity,
          image: imageUrl + item.backdrop_path,
          poster: imageUrl + item.poster_path,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
          overview: item.overview,
        };
      });
      let firstMovie = [];
      firstMovie.push(movieInfo[0]); // make firstData
      renderItemUI(movieInfo); //items render in aside
      headerUI(firstMovie); //firstData auto render in header
      clickHeaderData(movieInfo); //click item and show on header
      submitGrow(); // asideBlock open
    } catch (error) {
      console.log(error);
      renderErrorUI();
      submitGrow(); // asideBlock open
    }
    inputData.value = '';
  }
  getMovieApi();
});

// movie item 渲染函式
function renderItemUI(movieInfo) {
  // item UI
  let ItemUI = movieInfo.map(
    (item) =>
      `<li class="item">
      <section class="item__btn">
      <button id="${item.id}"></button>
      <figure>
      <img src=${item.poster} alt="" />
      </figure>
      <h1 >${item.name}</h1>
      </section>
      <p>${item.date}<span class="likeBtn" id="${item.id}"></span></p>
      </li>`,
  );
  items.innerHTML = ItemUI.join('');
}

//取得 header 渲染所需資料
function clickHeaderData(movieInfo) {
  const item = document.querySelectorAll('.item button');
  let headerData = [movieInfo[0]];
  footerBtn(headerData);
  //item
  item.forEach((element) => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      headerData = movieInfo.filter((item) => item.id == e.target.id);
      //執行 header 渲染
      footerBtn(headerData);
      headerUI(headerData);
    });
  });
  //prev
  prev.addEventListener('click', (e) => {
    e.preventDefault();
    headerData = movieInfo.filter((item) => {
      if (headerData[0].number - 1 <= 1) {
        return item.number == 1;
      } else {
        return item.number == headerData[0].number - 1;
      }
    });
    //執行 header 渲染
    footerBtn(headerData);
    headerUI(headerData);
  });
  //next
  next.addEventListener('click', (e) => {
    e.preventDefault();
    headerData = movieInfo.filter((item) => {
      if (headerData[0].number + 1 >= 20) {
        return item.number == 20;
      } else {
        return item.number == headerData[0].number + 1;
      }
    });
    //執行 header 渲染
    footerBtn(headerData);
    headerUI(headerData);
  });
}

//上一頁 & 下一頁 判斷
function footerBtn(headerData) {
  headerData[0].number == 1
    ? prev.classList.add('hidden')
    : prev.classList.remove('hidden');
  headerData[0].number == 20
    ? next.classList.add('hidden')
    : next.classList.remove('hidden');
}

// header 渲染函式
function headerUI(headerData) {
  //header UI
  let headerUI = headerData.map(
    (item) => `
    <ul class="header__number">
      <li>
        <p>INDEX</p>
        <span></span>
      </li>
      <li>${item.number}</li>
      <li>
        <span></span>
        <p>MOVIE</p>
      </li>
    </ul>
    <section class="header__title">
      <h1 class="title">${item.name}</h1>
      <ul class="info">
        <li class="info__data">
          <p class="date">Date : ${item.date}</p>
          <p class="average">
            Average : ${item.vote_average} Count : ${item.vote_count}
          </p>
        </li>
        <li class="info__btn">
          <button class="watch">Watch video</button>
          <button class="add">+ Add List</button>
        </li>
      </ul>
      <p class="description">${item.overview}</p>
    </section>
    <ul class="header__number">
    </ul>
    `,
  );
  //底圖 UI
  let BgcUI = headerData.map(
    (item) => `<img class="img-theme fade" src=${item.image} alt="" />`,
  );

  header.innerHTML = headerUI.join('');
  themeBgc.innerHTML = BgcUI.join('');
}

function renderErrorUI() {
  let errorItemUI = `<h3>NO SEARCH RESULTS</h3>`;
  let errorHeaderUI = `<ul class="header__number">
  <li>
    <p>INDEX</p>
    <span></span>
  </li>
  <li>S</li>
  <li>
    <span></span>
    <p>MOVIE</p>
  </li>
</ul>
<section class="header__title">
  <h2>Sorry...Please search again</h2>
</section>
<ul class="header__number"></ul>`;
  let errorBgcUI = ``;
  items.innerHTML = errorItemUI;
  header.innerHTML = errorHeaderUI;
  themeBgc.innerHTML = errorBgcUI;
}

//aside 開關設定
openBtn.addEventListener('click', () => {
  wrapperBlock.classList.toggle('flex-1');
  wrapperBlock.classList.toggle('flex-7');
  asideBlock.classList.toggle('flex-0');
  asideBlock.classList.toggle('flex-3');
});
//搜尋自動打開 aside
function submitGrow() {
  const item = document.querySelector('.item');
  if (wrapperBlock.classList.contains('flex-1')) {
    wrapperBlock.classList.toggle('flex-1');
    asideBlock.classList.toggle('flex-0');
    wrapperBlock.classList.toggle('flex-7');
    asideBlock.classList.toggle('flex-3');
  }
}
