import $ from "jquery";
import {gsap} from "gsap/gsap-core";
import CSSPlugin from "gsap/CSSPlugin";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import './inputmask/inputmask'

gsap.to('body', {duration: 0.5, opacity: 1})

$('.form__phone input, .footer__form-phone input').inputmask('+7 (999) 999-99-99')

$(".footer__form-file input[type=file]").change(function () {
    const filename = $(this).val().replace(/.*\\/, "");
    $("#fileValue").text(filename);
});

gsap.registerPlugin(CSSPlugin, ScrollToPlugin, ScrollTrigger, MotionPathPlugin)

//scroll-top
$('.header__scroll').click(function (e) {
    gsap.to(window, {duration: 1, scrollTo: {x: 0, y: 0}})
})

$('.header__item').on('click', function (e) {
    e.preventDefault()
    let currentId = $(e.currentTarget).find('a').attr('href')
    gsap.to(window, {duration: 1, scrollTo: {x: 0, y: $(currentId).position().top}})
})

//slide-button
let initialMouse = 0;
let slideMovementTotal = 0;
let mouseIsDown = false;
const slider = $('.appear__slider');

slider.on('mousedown touchstart', function (event) {
    mouseIsDown = true;
    slideMovementTotal = $('.appear__button').width() - $(this).width();
    initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    $('.appear__slider').css({animation: 'none'})
});

$(document.body, slider).on('mouseup touchend', function (event) {
    if (!mouseIsDown)
        return;
    mouseIsDown = false;
    let currentMouse = event.clientX || event.changedTouches[0].pageX;
    let relativeMouse = currentMouse - initialMouse;

    if (relativeMouse < slideMovementTotal) {
        $('.appear__fade').fadeTo(300, 1);
        gsap.to(slider, {duration: 0.3, left: '0'})
        gsap.to('.appear__form', {duration: 0.5, right: '-100%'})
    }

    if (Math.round(slideMovementTotal) === Math.round(+slider.css('left').replace('px', ''))) {
        const tl = gsap.timeline()
        tl
            .to($('.appear__button'), {duration: 0.5, opacity: 0, pointerEvents: 'none'})
            .to($('.appear__form'), {duration: 0.5, right: 0, pointerEvents: 'unset'})
    }
});

$(document.body).on('mousemove touchmove', function (event) {
    if (!mouseIsDown)
        return;

    let currentMouse = event.clientX || event.originalEvent.touches[0].pageX;
    let relativeMouse = currentMouse - initialMouse;
    let slidePercent = 1 - (relativeMouse / slideMovementTotal) >= 0 ? 1 - (relativeMouse / slideMovementTotal) : 0;
    let relativeMult = $(window).width() > 1440 ? 30 : 100

    console.log(slidePercent)

    $('.appear__fade').fadeTo(0, slidePercent - 0.5);

    $('.appear__form').css({right: -(slidePercent * relativeMult) + '%'})

    if (relativeMouse <= 0) {
        slider.css({'left': '0'});
        return;
    }
    if (relativeMouse >= slideMovementTotal) {
        slider.css({'left': slideMovementTotal + 'px'});
        return;
    }
    slider.css({'left': relativeMouse});
});

$('.form__close').click(function (e) {
    const tl = gsap.timeline()
    tl
        .to($('.appear__form'), {duration: 0.5, right: '-100%', pointerEvents: 'none'})
        .add(() => {
            $('.appear__slider').css({
                left: 0,
                animation: 'swipe 25s ease-in-out infinite'
            })
            $('.appear__fade').css({opacity: 1})
        })
        .to($('.appear__button'), {duration: 0.5, opacity: 1, pointerEvents: 'unset'})
})

ScrollTrigger.create({
    trigger: '.header',
    start: 'top-=25 top',
    onEnter: () => {
        const tl = gsap.timeline()
        tl
            .fromTo('.header', {top: 0, left: 0}, {
                duration: 0.3,
                position: 'fixed',
                top: 0,
                left: 0,
                opacity: 1,
                pointerEvents: 'unset'
            })
            .to('.header__nav', {duration: 0.5, opacity: 1})
            .to('.header__contact', {duration: 0.5, opacity: 1})
            .to('.header__scroll', {duration: 0.5, opacity: 1})

    },
    onLeaveBack: () => {
        gsap.to('.header', {duration: 0.3, position: 'absolute', top: 'unset', opacity: 0, pointerEvents: 'none'})
    },
})

ScrollTrigger.create({
    trigger: '.appear',
    start: 'bottom center',
    onEnter: self => {
        const tl = gsap.timeline()
        tl
            .to('#text-logo', {duration: 0.5, opacity: 0})
            .to('#main', {duration: 0.5, opacity: 0})
    },
    onEnterBack: self => {
        const tl = gsap.timeline()
        tl
            .to('#main', {duration: 0.5, opacity: 1})
            .to('#text-logo', {duration: 0.5, opacity: 1})
    },
    onLeaveBack: self => {
        const tl = gsap.timeline()
        tl
            .to('#main', {duration: 0.5, opacity: 1})
            .to('#text-logo', {duration: 0.5, opacity: 1})
    }
})


ScrollTrigger.create({
    trigger: '.services',
    start: 'top top+=150',
    end: 'bottom center-=150',
    onEnter: self => {
        $('[data-item="0"]').addClass('active')
    },
    onLeave: self => {
        $('[data-item]').removeClass('active')
        gsap.to('.header__logo', {duration: 0.5, opacity: 1})
    },
    onLeaveBack: self => {
        $('[data-item]').removeClass('active')
    },
    onEnterBack: self => {
        $('[data-item="0"]').addClass('active')
        gsap.to('.header__logo', {duration: 0.5, opacity: 0})
    }
})

const timers = []

ScrollTrigger.create({
    trigger: '.process',
    start: 'top top+=150',
    end: 'bottom center-=150',
    onEnter: self => {
        $('[data-item="1"]').addClass('active')
        $('.process__list').addClass('active')
        const processItem = $('.process__item')
        const tl = gsap.timeline()
        tl
            .to('.process__arrow', {duration: 0, delay: 0.5, opacity: 1})
            .add(() => {
                for (let i = 0; i < processItem.length; i++) {
                    timers[i] = setTimeout(() => {
                        $(processItem[i]).addClass('active-dots')
                    }, (i * 150))
                }
            })
            .addPause(1.5)
            .add(() => {
                for (let i = 0; i < processItem.length; i++) {
                    timers[i] = setTimeout(() => {
                        $(processItem[i]).addClass('active')
                        const sublist = $(processItem[i]).find('.process__sublist')
                        gsap.to(sublist, {duration: 0.2, bottom: 0})
                    }, (i * 450))
                }
            })
    },
    onLeave: self => {
        $('[data-item]').removeClass('active')
    },
    onLeaveBack: self => {
        $('[data-item]').removeClass('active')
    },
    onEnterBack: self => {
        $('[data-item="1"]').addClass('active')
    }
})

ScrollTrigger.create({
    trigger: '.exp',
    start: 'top+=100 top+=150',
    end: 'bottom-=150 center-=250',
    onEnter: self => {
        $('[data-item="2"]').addClass('active')
        const tl = gsap.timeline()
        tl
            .to('.header__logo', {duration: 0.5, opacity: 0})
            .to('.exp__logo', {duration: 0.5, opacity: 1})
            .to('.exp__speech', {duration: 0.5, transform: 'scale(1)'})
    },
    onLeave: self => {
        $('[data-item]').removeClass('active')
        const tl = gsap.timeline()
        tl
            .to('.exp__speech', {duration: 0.5, transform: 'scale(0)'})
            .to('.exp__logo', {duration: 0.5, opacity: 0})
            .to('.header__logo', {duration: 0.5, opacity: 1})
    },
    onLeaveBack: self => {
        $('[data-item]').removeClass('active')
        const tl = gsap.timeline()
        tl
            .to('.exp__speech', {duration: 0.5, transform: 'scale(0)'})
            .to('.exp__logo', {duration: 0.5, opacity: 0})
            .to('.header__logo', {duration: 0.5, opacity: 1})
    },
    onEnterBack: self => {
        $('[data-item="2"]').addClass('active')
        const tl = gsap.timeline()
        tl
            .to('.header__logo', {duration: 0.5, opacity: 0})
            .to('.exp__logo', {duration: 0.5, opacity: 1})
            .to('.exp__speech', {duration: 0.5, transform: 'scale(1)'})
    }
})

ScrollTrigger.create({
    trigger: '.projects',
    start: 'top+=100 top+=150',
    end: 'bottom-=150 center-=250',
    onEnter: self => {
        $('[data-item="3"]').addClass('active')
    },
    onLeave: self => {
        $('[data-item]').removeClass('active')
    },
    onLeaveBack: self => {
        $('[data-item]').removeClass('active')
    },
    onEnterBack: self => {
        $('[data-item="3"]').addClass('active')
    }
})

ScrollTrigger.create({
    trigger: '.footer',
    start: 'top top+=150',
    end: 'bottom-=150 center-=250',
    onEnter: self => {
        $('[data-item="4"]').addClass('active')
    },
    onLeave: self => {
        $('[data-item]').removeClass('active')
    },
    onLeaveBack: self => {
        $('[data-item]').removeClass('active')
    },
    onEnterBack: self => {
        $('[data-item="4"]').addClass('active')
    }
})

const tabsEmoji = $('.services__item'),
    tabsDialogs = $('.services__dialog'),
    tab0 = $('[data-tab-index="0"]').find('span'),
    tab1 = $('[data-tab-index="1"]').find('span'),
    tab2 = $('[data-tab-index="2"]').find('span'),
    tab3 = $('[data-tab-index="3"]').find('span')


for (let i = 0; i < tabsEmoji.length; i++) {
    $(tabsEmoji[i]).click(function (e) {
        $('.services__item.active').removeClass('active')
        $('.services__item').find('img.active').removeClass('active')
        $('.services__item').find('video.active').removeClass('active')
        $('.services__dialog.active').removeClass('active')
        $('.services__dialog.active .request').removeAttr('style')

        $(tabsEmoji[i]).addClass('active')
        $(tabsEmoji[i]).find('img').addClass('active')
        $(tabsEmoji[i]).find('video').addClass('active')
        $(tabsEmoji[i]).find('span').addClass('active')

        let emojiTabIndex = $(tabsEmoji[i]).attr('data-tab-index')
        let tabIndex = $(tabsDialogs[i]).attr('data-tab')


        if (emojiTabIndex === tabIndex) {
            $(tabsDialogs[i]).addClass('active')
            const tl = gsap.timeline()
            if (i === 4) {
                tl
                    .fromTo($('.services__dialog.active .request'), {transform: 'scale(0.75)'}, {
                        duration: 0.3,
                        transform: 'scale(1, 1)',
                        ease: 'power1.inOut'
                    })
                    .fromTo($('.services__dialog.active .response__block'), {
                        transform: 'scaleY(0)',
                        opacity: 0
                    }, {duration: 0, transform: 'scaleY(1)', opacity: 1})
                    .fromTo($('.services__dialog.active .response__block'), {transform: 'scaleX(0)'}, {
                        duration: 5,
                        transform: 'scaleX(1)'
                    })
                    .fromTo($('.services__dialog.active .response__title'), {opacity: 0}, {duration: 0.5, opacity: 1})
            } else {
                tl
                    .fromTo($('.services__dialog.active .request'), {transform: 'scale(0.75)'}, {
                        duration: 0.3,
                        transform: 'scale(1, 1)',
                        ease: 'power1.inOut'
                    })
                    .fromTo($('.services__dialog.active .response__block'), {
                        transform: 'scale(0.9)',
                        opacity: 0
                    }, {delay: 0.2, duration: 0.3, transform: 'scale(1, 1)', opacity: 1, ease: 'power1.inOut'})
                    .fromTo($('.services__dialog.active .tags'), {opacity: 0}, {duration: 0.5, delay: 0.5, opacity: 1})
            }
        }
        if (tab0.hasClass('active') && tab1.hasClass('active') && tab2.hasClass('active') && tab3.hasClass('active')) {
            $('[data-tab-index="4"]').css({
                display: 'block'
            })
        }
    })
}

$('.header__contact').click(function (e) {
    const tl = gsap.timeline()
    tl
        .to(window, {duration: 1, scrollTo: {x: 0, y: 0}})
        .to($('.appear__button'), {duration: 0.2, opacity: 0, pointerEvents: 'none'})
        .to($('.appear__form'), {duration: 0.5, right: '-10px', pointerEvents: 'unset'})
})