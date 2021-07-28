import {gsap} from "gsap/gsap-core";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import CSSPlugin from "gsap/CSSPlugin";
import ScrollToPlugin from "gsap/ScrollToPlugin";


window.addEventListener('load', () => {
    const $ = (selector) => document.querySelectorAll(selector) > 1 ? document.querySelectorAll(selector) : document.querySelector(selector)

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CSSPlugin)

    const humansSpeed = $('.history__couple').getAttribute('data-speed')
    const houseSpeed = $('.history__house_main').getAttribute('data-speed')
    const bgSpeed = $('.history__main').getAttribute('data-speed')

    $('.history').addEventListener('mousemove', e => {
        let posx = e.pageX,
            posy = e.pageY,
            left = 0,
            top = 0

        left = window.innerWidth / 2 - posx
        top = window.innerHeight / 2 - posy

        gsap.to('.history__main', {duration: Number(bgSpeed), transform: `translate(${left / 50}px, ${top / 30}px)`})
        gsap.to('.history__house_main', {duration: Number(houseSpeed), transform: `translate(${left / 90 * -1}px, ${top / 200 * -1}px)`})
        gsap.to('.history__moon', {duration: Number(bgSpeed), transform: `translate(${left / 30 * -1}px, ${top / 100 * -1}px)`})
        gsap.to('.history__car', {duration: Number(humansSpeed), transform: `translate(${left / 50}px, ${top / 80}px)`})
        gsap.to('.history__couple', {duration: Number(humansSpeed), transform: `translate(${left / 50}px, ${top / 80}px)`})
        gsap.to('.history__man', {duration: Number(humansSpeed), transform: `translate(${left / 50}px, ${top / 80}px)`})
    })


    ScrollTrigger.create({
        trigger: '.history',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: self => {
            const tl = gsap.timeline()
            for (let i = 0; i < 1200; i++) {
                setTimeout(() => {
                    $('.c-mask-circle').setAttribute('r', `${i}`)
                }, i / 3)
            }
            tl
                .fromTo('.history__car', {opacity: 0, left: '-150px'}, {duration: 1, opacity: 1, left: '35px'})
                .fromTo('.history__man', {opacity: 0}, {duration: 0.5, opacity: 1})
                .fromTo('.history__couple', {opacity: 0}, {duration: 0.5, opacity: 1})

        },
        onEnterBack: self => {
            const tl = gsap.timeline()
            tl
                .fromTo('.history__couple', {delay: 1, duration: 1, opacity: 1})
                .fromTo('.history__car', {duration: 1, opacity: 1, left: '35px'})
                .fromTo('.history__man', {duration: 1, opacity: 1})

        }
    })
})

