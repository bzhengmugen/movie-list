// model

const state = {
    movies: [],
    likedList: [],
    currentPage: 1,
    totalPage: 0
  
  }
  
  const API_KEY = "866e1d3c9c2877c7026c17345d18c8f6"
  const URL = "https://api.themoviedb.org/3/movie"
  const IMAGE_URL = "https://image.tmdb.org/t/p/w500"
  // controller
  
  function handleSelect(item){
    // console.log(item);
    fetchMovie(item);
  
  }
  
  function handlePrev(item){
    if(state.currentPage === 1){
      return
    }else{
      state.currentPage -= 1;
      fetchMovie(item)
    }
  }
  
  function handleNext(item){
    if(state.currentPage === state.totalPage){
      return
    }else{
      state.currentPage += 1;
      fetchMovie(item)
    }
  }
  
  function handleLikedList(){
    const movieContainer = document.querySelector('.home-container');
    const likedContainer = document.querySelector('.liked-container');
    const pageNav = document.querySelector('.page-nav');
    movieContainer.className = "disp-container home-container hidden";
    likedContainer.className = "disp-container liked-container";
    pageNav.className = "page-nav hidden";
    likedContainer.innerHTML = '';
    state.likedList.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      likedContainer.append(movieCard);
    });
  }
  
  function handleHome(){
    const movieContainer = document.querySelector('.home-container');
    const likedContainer = document.querySelector('.liked-container');
    const pageNav = document.querySelector('.page-nav');
    movieContainer.className = "disp-container home-container ";
    likedContainer.className = "disp-container liked-container hidden";
    pageNav.className = "page-nav ";
    renderView() 
  }
  
  function handleLikedMovieContorl(e){
    handleMovieContorl(e);
    const likedContainer = document.querySelector('.liked-container');
    likedContainer.innerHTML = '';
    state.likedList.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      likedContainer.append(movieCard);
    });
  
  }
  
  
  function handleDetail(id){
    const queryString = `${URL}/${id}?api_key=${API_KEY}&language=en-US`
    // console.log(queryString)
    fetch(queryString).then((resp) =>{
      if(resp.ok){
        return resp.json()
      }
      throw new Error(resp.statusText);
  
    }).then((data) =>{
      console.log(data);
      createDetail(data);
    })
  }
  
  function createDetail(data){
    const detailContainer = document.querySelector('.detail-container');
    detailContainer.className = "detail-container";
    const genresList = data.genres.map(genre =>{
      return genre.name;
    })
  
    const productorList = data.production_companies.map(corp =>{
      return {
        logo_path: corp.logo_path,
        name: corp.name
      };
    })
  
    console.log(genresList)
    console.log(productorList)
  
    const genresStr = genresList.reduce((finalStr,genre) =>{
      return finalStr + "<div class='genre'>"+genre+"</div>"
    },``)
    console.log(genresStr);
  
    const logoStr = productorList.reduce((finalStr, corp) =>{
      return finalStr + "<img class='logo-img' src='" +IMAGE_URL+corp.logo_path+ "' alt='"+ corp.name + "' />" 
    },``);
    console.log(logoStr)
  
    detailContainer.innerHTML = `
      <div class="detail">
        <div class="exit">&#x2716;</div>
        <img class="movie-img" src="${IMAGE_URL}${data.poster_path}" />
        <div class="detail-info">
          <h3> ${data.title}</h3>
          <div class = "overview">
            <h4>Overview</h4>
            <p>${data.overview}</p>
          </div>
          <div class="genres-container">
            <h4> Genres </h4>
            <div class="genres">
              ${genresStr}
            </div>
          </div>
          <div class="rating">
            <h4> Rating </h4>
            <p> ${data.vote_average}</p>
          </div>
          <div class="productions">
            <h4>Production compaines</h4>
            <div class="corp-logos">
              ${logoStr}
            </div>
          </div>
        </div>
      </detail>
    `
  }
  
  function handleDetailExit(e){
    console.log(e.target);
    if(e.target.className === "exit"){
      e.target.closest('.detail-container').className = "detail-container hidden"
    }
  }
  
  function handleMovieContorl(e){
    // console.log(e.target)
    if(e.target.closest('.movie') === null){
      return;
    }
    const movieID = e.target.closest('.movie').id;
    // console.log(movieID)
    const movieItem = state.movies.find((movie) => {
      // console.log(movie.id)
      return movie.id === Number(movieID)
    })
    // console.log(movieItem)
    if(e.target.className === "ion-ios-heart-outline"){
      state.likedList.push(movieItem);
      e.target.className = "ion-ios-heart";
    }else if(e.target.className === "ion-ios-heart"){
      state.likedList = state.likedList.filter(movie => {
        return movie.id != Number(movieID);
      })
      e.target.className = "ion-ios-heart-outline";
    }else if(e.target.className === "movie-title"){
      handleDetail(movieID);
    }
    // console.log(state.likedList)
  }
  
  const fetchMovie = (item) => {
    const url = `${URL}/${item}?api_key=${API_KEY}&page=${state.currentPage}`;
    // console.log(url);
  
    fetch(url).then((resp) => {
      if(resp.ok){
        return resp.json()
      }
      throw new Error(resp.statusText)
  
      }).then((data) => {
        
        state.movies = data.results;
        state.totalPage = data.total_pages;
        // console.log(state.movies)
        renderView();
      }).catch( err =>{
        
      })
  }
  
  function createMovieCard(movie){
    const cardContainer = document.createElement('div')
    cardContainer.className = "movie";
    cardContainer.id = movie.id;
  
    const isLiked = state.likedList.find(item => {  
      return item.id === movie.id
    });
  
    const likeIcon = isLiked ? "ion-ios-heart" : "ion-ios-heart-outline";
  
    cardContainer.innerHTML = `
    <img class="movie-img" src="${IMAGE_URL}${movie.poster_path}" />
    <h4> <span class="movie-title">${movie.title} </span></h4>
    <div class="feature">
    <div class="rate">
    <i class="ion-star"></i> <span> ${movie.vote_average} </span>
    </div>
    <div class="is-liked">
    <i class="${likeIcon}"></i>
    </div>
    </div>
    `;
    
  
    return cardContainer;
  }
  
  
  function renderView(){
    // console.log("render view")
    const displapMovie = document.querySelector('.home-container');
    const displayedPage = document.querySelector('#current-page');
    displapMovie.innerHTML = '';
    displayedPage.innerHTML = `${state.currentPage} / ${state.totalPage}`
    state.movies.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      displapMovie.append(movieCard);
    });
  }
  
  
  //view
  
  
  function handleEvent(){  
    const selectedItem = document.querySelector('.page-type');
  
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
  
    const movieContorller = document.querySelector('.home-container');
    const likedContorller = document.querySelector('.liked-container');
    const detailContorller = document.querySelector('.detail-container');
    const likedListContorller = document.querySelector('.like-list-button');
    const homeContorller = document.querySelector('.home-button');
    // console.log(selectedItem.value);
    fetchMovie(selectedItem.value);
    selectedItem.addEventListener('change', function(event) {
      state.currentPage = 1;
      homeContorller.className = "home-button focus-list";
      likedListContorller.className = "like-list-button unfocus-list"
      handleSelect(this.value);
      handleHome();
    });
  
    prevBtn.addEventListener('click', () =>{
      handlePrev(selectedItem.value);
    })
    nextBtn.addEventListener('click', () =>{
      handleNext(selectedItem.value);
    })
  
    movieContorller.addEventListener('click', e =>{
      handleMovieContorl(e);
    })
  
    likedContorller.addEventListener('click', e =>{
      handleLikedMovieContorl(e);
    })
  
    likedListContorller.addEventListener('click', () =>{
      homeContorller.className = "home-button unfocus-list";
      likedListContorller.className = "like-list-button focus-list"
      handleLikedList();
    })
    homeContorller.addEventListener('click', () =>{
      homeContorller.className = "home-button focus-list";
      likedListContorller.className = "like-list-button unfocus-list"
  
      handleHome();
    })
    detailContorller.addEventListener('click', e =>{
      handleDetailExit(e);
    })
  }
  
  
  
  handleEvent()