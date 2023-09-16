'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btn_scroll_to = document.querySelector('.btn--scroll-to');
const section_1 = document.querySelector('#section--1')   
const tabs = document.querySelectorAll('.operations__tab');
const tabs_container = document.querySelector('.operations__tab-container');
const tabs_content = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav')
const header = document.querySelector('.header');
const all_section = document.querySelectorAll('.section');
const img_targets = document.querySelectorAll('img[data-src]');

// Functions 
const handle_hower = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    
    siblings.forEach(element => {
      if(element !== link)element.style.opacity =this;
    })
    logo.style.opacity = this;
  }
}

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// /////////////////////////
// Button Navigation 

//1 Add event listener to common parent element
//2 determined what element originated the event
document.querySelector('.nav__links').addEventListener('click',function(e){

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);

    document.querySelector(id).scrollIntoView({behavior: 'smooth' })
  }
})

// Tabbed Component
tabs_container.addEventListener('click',function(e){
  const clicked =e.target.closest('.operations__tab');

  if(!clicked)return;

  //active tab
  tabs.forEach(t=>t.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active');
  
  //Activate Content Area
  tabs_content.forEach(t=>t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');


})

// Menu Fade Animations

// Passing Argument to the handler Function
nav.addEventListener('mouseover',handle_hower.bind(0.5))
nav.addEventListener('mouseout',handle_hower.bind(1))

// // Sticky Navigation
// const initial_coordinate=  section_1.getBoundingClientRect()
// window.addEventListener('scroll',function(){
//   console.log(window.scrollY);
//   if(window.scrollY > initial_coordinate.top){
//     nav.classList.add('sticky');
//   }
//   else nav.classList.remove('sticky');

// })

// // Sticky navigation: Intersection Observer API 
// const obs_callback = function(entries,observer){
//   entries.forEach(entry=> console.log(entry));
// }

// const obs_options ={
//   root : null,
//   threshold : 0.1,

// }


// const observer = new IntersectionObserver(obs_callback,obs_options);
// observer.observe(section_1);


const nav_height = nav.getBoundingClientRect().height;
const sticky_Nav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }
  else
  nav.classList.remove('sticky');
}

const header_observer = new IntersectionObserver
(sticky_Nav,{
  root:null,
  threshold:0,
  rootMargin:`-${nav_height}px`,
});

header_observer.observe(header);

// Reveal Section

const reveal_section = function(entries,observer){
  const [entry] = entries;
  
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const section_observer = new IntersectionObserver
(reveal_section,{
  root:null,
  threshold:0.15  
});
all_section.forEach(function(section){
  section_observer.observe(section)
  // section.classList.add('section--hidden');
})


// Lazy Loading Images 
const lazy_loading_images = function(entries,observer){
  const [entry] = entries
  if(!entry.isIntersecting)return;
  // Replace src with data src
  entry.target.src = entry.target.dataset.src
  
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img')
  });
  observer.unobserve(entry.target);
}
const img_observer = new IntersectionObserver
(lazy_loading_images,{
  root:null,
  threshold:0,
  rootMargin:'200px',
});
img_targets.forEach(img =>  img_observer.observe(img))

const _slider = function(){

// Slider 
const slides = document.querySelectorAll('.slide')
const btn_left = document.querySelector('.slider__btn--left')
const btn_right = document.querySelector('.slider__btn--right')
const dot_container = document.querySelector('.dots');

let current_slide  = 0;
const max_slide = slides.length

// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

// function create dot
const create_dot = function(){
  slides.forEach((_,i)=>{
    dot_container.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${i}">
    </button>`);
  })
}

//acticvate the dot
const activate_dot = function(slide){
  document
  .querySelectorAll('.dots__dot')
  .forEach(dot=>dot.classList
  .remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList
  .add('dots__dot--active');
};

// Function go to slide 
const go_to_slide  = function(slide) {
  slides.forEach((s,i) =>s.style.transform = `translateX(${100*(i-slide)}%)`)
}

// call next slide
const next_slide =function(){
  if(current_slide === max_slide-1){
    current_slide = 0;
  }else{
    current_slide++;
  }
  go_to_slide(current_slide);
  activate_dot(current_slide);
}
const prev_slide = function(){
  if(current_slide === 0){
    current_slide = max_slide-1;
  }else{
    current_slide--;
  }
  go_to_slide(current_slide);
  activate_dot(current_slide);
} ;

// Next  Slide 
btn_right.addEventListener('click',next_slide)
// Previous Slide
btn_left.addEventListener('click',prev_slide)

// NEXT SLIDE BY KEY DOWN EVENT 
document.addEventListener('keydown',function(e) {
  if(e.key === 'ArrowLeft')prev_slide();
  e.key === 'ArrowRight' && next_slide();
})

dot_container.addEventListener('click',function(e) {
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    go_to_slide(slide);
    activate_dot(slide);
  }

})
const init = function(){
  go_to_slide(0);
  create_dot();
  activate_dot(0);
}
init();
}
_slider();
/*

this solution is not good enough for this if we have a thousands of buttons so this creates thousands  of copies 
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth' })
  })
})
*/
btn_scroll_to.addEventListener('click',function(e){
  const s1_coordinate = section_1.getBoundingClientRect();
 //Scrolling
  // window.scrollTo(
  //   s1_coordinate.left+window.pageXOffset,
  //   s1_coordinate.top+ window.pageYOffset);

  // window.scrollTo({
  //   left: s1_coordinate.left + window.pageXOffset,
  //   top: s1_coordinate.top + window.pageYOffset,
  //   behavior: 'smooth',  
  // })
  
  //modern way
  section_1.scrollIntoView({behavior: 'smooth' })
});


 








////////////////////////////////////////////////////////////////
////////////////////////////////
////////////////////////////////////////////////////////////////

// // Selecting element 
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const head = document.querySelector('.header');
// const all_section = document.querySelectorAll('.section');
// console.log(all_section)

// document.getElementById('section--1')
// const all_button = document.getElementsByTagName('button')
// console.log(all_button)

// console.log(document.getElementsByClassName('btn'))

 

//creating & Inserting elements

// .insertAdjacentHTML()

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// //message.textContent = 'We Use Cookies for Improved Functionality & Analytics';
// message.innerHTML = 'We Use Cookies for Improved Functionality & Analytics.<button class="btn btn--close-cookie">Got it!</button> ';
// head.prepend(message)
// // head.append(message.cloneNode(true));
// //head.after(message)


// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   //message.remove();
//   message.parentElement.removeChild(message)

// })


// //Style 

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).height)
// message.style.height = Number.parseFloat(getComputedStyle(message).height,10)+50+'px';

// document.documentElement.style.setProperty(
//   '--color-primary','orangered'
// )

// // Attributes

// const logo = document.querySelector('.nav__logo')
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company','Bankist');

 
// console.log(logo.dataset.versionNumber)


// const h1 = document.querySelector('h1'); 

// // Going downwards : child n
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';


// // Going upwards : child

// console.log(h1.parentNode)
// console.log(h1.parentElement)

// h1.closest('.header').style.background = 'var(--gradient-secondary)'
// h1.closest('h1').style.background = 'var(--gradient-primary)'


// // Going sideways : sibling


// console.log(h1.previousElementSibling)
// console.log(h1.nextElementSibling)



// console.log(h1.previousSibling)
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(element => {
//   if(element !== h1)
//   {element.style.transform = 'scale(0.5)';}
// });
