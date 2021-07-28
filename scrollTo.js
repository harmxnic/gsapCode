import {gsap} from "gsap/gsap-core";
import CSSPlugin from "gsap/CSSPlugin";
import ScrollToPlugin from "gsap/ScrollToPlugin";

window.addEventListener('load', () => {

    const $ = query => document.querySelectorAll(query).length > 1 ? document.querySelectorAll(query) : document.querySelector(query)

    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0)
    })

    gsap.registerPlugin(CSSPlugin, ScrollToPlugin)

    gsap.to('body', {delay: .3, duration: 1, opacity: 1})

    setTimeout(() => {
        document.querySelector('.header__logo svg').classList.add('active')
    }, 300)

    const headerAnchors = $('.header__item a')
    const footerAnchors = $('.footer__item a')
    const articleAnchors = $('.footer__link a')

    function anchorIter(...args) {
        for (let i = 0; i < args.length; i++) {
            args[i].forEach(el => {
                let id = el.getAttribute('href')
                let block = $(id).getBoundingClientRect().y

                el.addEventListener('click', (e) => {
                    e.preventDefault()
                    gsap.to(window, {duration: 0.5, scrollTo: {x: 0, y: block}})
                })
            })
        }
    }

    anchorIter(headerAnchors, footerAnchors, articleAnchors)

    $('.header__wrapper').addEventListener('click', e => {
        $('.header__burger').classList.toggle('active')
        $('.header__menu').classList.toggle('active')
    })
})