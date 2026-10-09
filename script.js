(function () {
    'use strict';

    // Helper Selector
    var $ = function (id) {
        return document.getElementById(id);
    };

    var root = document.documentElement;

    var yrElement = $("yr");
    if (yrElement) {
        yrElement.textContent = new Date().getFullYear();
    }

    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem("theme");
    } catch (e) { }

    var isDark = savedTheme ? savedTheme === "dark" : true;

    function setTheme() {
        root.setAttribute("data-theme", isDark ? "dark" : "light");
        var icon = $("theme-icon");
        if (icon) {
            icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch (e) { }
    }

    var themeBtn = $("theme");
    if (themeBtn) {
        themeBtn.onclick = function () {
            isDark = !isDark;
            setTheme();
        };
    }
    setTheme();

    document.querySelectorAll('.card, .btn').forEach(function (el) {
        el.addEventListener('touchstart', function () {
            el.classList.add('touch-active');
        }, { passive: true });

        el.addEventListener('touchend', function () {
            el.classList.remove('touch-active');
        }, { passive: true });

        el.addEventListener('touchcancel', function () {
            el.classList.remove('touch-active');
        }, { passive: true });
    });

    var revealElements = document.querySelectorAll(".rv");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(function (e) {
            io.observe(e);
        });
    } else {
        revealElements.forEach(function (e) {
            e.classList.add("in");
        });
    }

    var cv = $("fx");
    if (!cv) return;

    var g = cv.getContext("2d"),
        hero = cv.parentNode,
        V = [],
        E = [],
        W = 0,
        H = 0,
        t = 0,
        mx = 0,
        my = 0,
        tx = 0,
        ty = 0,
        still = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        i, j,
        G = [],
        sy = ["\u2713", "{ }", "</>", "200", "404", "PASS", "FAIL", "API", "bug", "assert"];

    for (i = 0; i < 16; i++) {
        V.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
    }

    for (i = 0; i < 16; i++) {
        for (j = i + 1; j < 16; j++) {
            var d = i ^ j;
            if (d && !(d & (d - 1))) E.push([i, j]);
        }
    }

    for (i = 0; i < 16; i++) {
        G.push({
            s: sy[i % sy.length],
            x: Math.random(),
            y: Math.random(),
            v: .00008 + Math.random() * .00012,
            z: .4 + Math.random() * .9
        });
    }

    function size() {
        var r = Math.min(window.devicePixelRatio || 1, 2);
        W = cv.clientWidth;
        H = cv.clientHeight;
        cv.width = W * r;
        cv.height = H * r;
        g.setTransform(r, 0, 0, r, 0, 0);
    }

    function rot(v, a, b, q) {
        var c = Math.cos(q),
            s = Math.sin(q),
            x = v[a],
            y = v[b];
        v[a] = x * c - y * s;
        v[b] = x * s + y * c;
    }

    hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - .5;
        ty = (e.clientY - r.top) / r.height - .5;
    });

    function frame() {
        if (window.scrollY < hero.offsetHeight + 50 && !document.hidden) {
            g.clearRect(0, 0, W, H);
            var hc = root.getAttribute("data-theme") === "dark" ? "96,200,255" : "37,99,235";
            mx += (tx - mx) * .05;
            my += (ty - my) * .05;

            g.font = "13px Consolas,monospace";
            g.fillStyle = "rgba(" + hc + ",.22)";
            G.forEach(function (o) {
                o.y -= o.v * o.z * 16;
                if (o.y < -.05) o.y = 1.05;
                g.globalAlpha = .25 + o.z * .3;
                g.fillText(o.s, o.x * W - mx * 60 * o.z, o.y * H - my * 40 * o.z);
            });

            g.globalAlpha = 1;
            var S = Math.min(W, H) * (W < 800 ? .3 : .44),
                ox = W < 800 ? W * .5 : W * .73,
                oy = H * (W < 800 ? .3 : .5),
                P = V.map(function (v) {
                    var p = v.slice();
                    rot(p, 0, 3, t);
                    rot(p, 1, 2, t * .7);
                    rot(p, 0, 1, t * .4);
                    var k = 1 / (2.6 - p[3]),
                        x = p[0] * k * 1.6,
                        y = p[1] * k * 1.6,
                        z = p[2] * k * 1.6;
                    var a = t * .5 + mx * 2.5,
                        b = my * 2,
                        x2 = x * Math.cos(a) + z * Math.sin(a),
                        z2 = -x * Math.sin(a) + z * Math.cos(a);
                    var y2 = y * Math.cos(b) - z2 * Math.sin(b);
                    z2 = y * Math.sin(b) + z2 * Math.cos(b);
                    var f = 1 / (3 - z2);
                    return [ox + x2 * f * S * 1.6, oy + y2 * f * S * 1.6, z2];
                });

            E.forEach(function (e) {
                var A = P[e[0]],
                    B = P[e[1]],
                    d = (A[2] + B[2]) / 2;
                g.strokeStyle = "rgba(" + hc + "," + (.3 + .3 * (d + 1.5) / 3) + ")";
                g.lineWidth = 1.3;
                g.beginPath();
                g.moveTo(A[0], A[1]);
                g.lineTo(B[0], B[1]);
                g.stroke();
            });

            P.forEach(function (p) {
                g.fillStyle = "rgba(" + hc + ",.9)";
                g.beginPath();
                g.arc(p[0], p[1], 2.4, 0, 6.3);
                g.fill();
            });

            t += .004;
        }
        if (!still) requestAnimationFrame(frame);
    }

    size();
    window.addEventListener("resize", function () {
        size();
        if (still) frame();
    });
    frame();

    if (!still && window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".card").forEach(function (c) {
            c.addEventListener("mousemove", function (e) {
                var r = c.getBoundingClientRect(),
                    x = (e.clientX - r.left) / r.width - .5,
                    y = (e.clientY - r.top) / r.height - .5;
                c.style.transform = "perspective(700px) rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 8) + "deg) translateY(-6px)";
            });
            c.addEventListener("mouseleave", function () {
                c.style.transform = "";
            });
        });
    }

    var B = $("bg");
    if (!B) return;

    var b = B.getContext("2d"),
        BW = 0,
        BH = 0,
        T = 0,
        mx2 = 0,
        my2 = 0,
        mtx = 0,
        mty = 0,
        O = [],
        F = [];

    function cube(n) {
        var V = [], E = [], N = 1 << n, i, j, d, k;
        for (i = 0; i < N; i++) {
            var v = [];
            for (k = 0; k < n; k++) v.push(i >> k & 1 ? 1 : -1);
            V.push(v);
        }
        for (i = 0; i < N; i++)
            for (j = i + 1; j < N; j++) {
                d = i ^ j;
                if (d && !(d & (d - 1))) E.push([i, j]);
            }
        return { V: V, E: E };
    }

    function cross(n) {
        var V = [], E = [], i, j, k;
        for (i = 0; i < 2 * n; i++) {
            var v = [];
            for (k = 0; k < n; k++) v.push(0);
            v[i >> 1] = i & 1 ? 1 : -1;
            V.push(v);
        }
        for (i = 0; i < 2 * n; i++)
            for (j = i + 1; j < 2 * n; j++)
                if (i >> 1 !== j >> 1) E.push([i, j]);
        return { V: V, E: E };
    }

    function mk(g, n, x, y, s, par, sp, hue) {
        var pl = [], a, c;
        for (a = 0; a < n; a++)
            for (c = a + 1; c < n; c++) pl.push([a, c, (.3 + Math.random()) * sp * (Math.random() < .5 ? -1 : 1)]);
        O.push({ V: g.V, E: g.E, n: n, x: x, y: y, s: s, par: par, pl: pl, hue: hue, ph: Math.random() * 9 });
    }

    mk(cube(5), 5, .16, .45, 1, .25, .55, 0);
    mk(cross(4), 4, .88, .9, .75, .35, .8, 1);
    mk(cube(4), 4, .82, .2, .6, .15, .7, 0);
    mk(cross(3), 3, .08, 1.15, .5, .5, 1, 1);
    mk(cube(3), 3, .92, 1.55, .5, .45, 1, 0);
    mk(cube(3), 3, .3, 1.9, .45, .6, 1.1, 1);
    mk(cube(5), 5, .78, 2.3, .8, .3, .5, 1);
    mk(cross(4), 4, .12, 2.6, .7, .4, .8, 0);

    for (var q = 0; q < 110; q++) F.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() });
    if (window.innerWidth < 700) F.length = 55;

    function bsize() {
        var r = Math.min(window.devicePixelRatio || 1, 2);
        BW = B.clientWidth;
        BH = B.clientHeight;
        B.width = BW * r;
        B.height = BH * r;
        b.setTransform(r, 0, 0, r, 0, 0);
    }

    window.addEventListener("mousemove", function (e) {
        mtx = e.clientX / BW - .5;
        mty = e.clientY / BH - .5;
    });

    function pr(v, n, pl, t) {
        var p = v.slice(), i, d;
        for (i = 0; i < pl.length; i++) rot(p, pl[i][0], pl[i][1], t * pl[i][2]);
        for (d = n - 1; d >= 3; d--) {
            var k = 1 / (2.8 - p[d]);
            for (i = 0; i < d; i++) p[i] *= k * 1.7;
        }
        return p;
    }

    function bframe() {
        if (!document.hidden) {
            var dk = root.getAttribute("data-theme") === "dark",
                sy = window.scrollY,
                col = dk ? "96,200,255" : "37,99,235",
                col2 = dk ? "150,130,255" : "79,70,229",
                al = dk ? .9 : .5;

            b.clearRect(0, 0, BW, BH);
            mx2 += (mtx - mx2) * .04;
            my2 += (mty - my2) * .04;

            var cxx = BW / 2 + mx2 * 120,
                cyy = BH / 2 + my2 * 80;

            F.forEach(function (f) {
                f.z -= .0016;
                if (f.z < .04) {
                    f.z = 1;
                    f.x = Math.random() * 2 - 1;
                    f.y = Math.random() * 2 - 1;
                }
                var fx = f.x + Math.sin(T * 2 + f.y * 4) * .05,
                    k = .55 / f.z,
                    X = cxx + fx * k * BW * .5,
                    Y = cyy + f.y * k * BH * .5 - sy * .05 * (1 - f.z),
                    k2 = .55 / (f.z + .03),
                    X2 = cxx + fx * k2 * BW * .5,
                    Y2 = cyy + f.y * k2 * BH * .5 - sy * .05 * (1 - f.z);

                b.strokeStyle = "rgba(" + col + "," + ((1 - f.z) * .5 * al) + ")";
                b.lineWidth = .6 + (1 - f.z) * 1.3;
                b.beginPath();
                b.moveTo(X2, Y2);
                b.lineTo(X, Y);
                b.stroke();
            });

            O.forEach(function (o) {
                var S = Math.min(BW, BH) * .22 * o.s,
                    wr = BH + 500,
                    oy = ((o.y * BH - sy * o.par) % wr + wr) % wr - 250,
                    ox = o.x * BW + Math.sin(T + o.ph) * 20 - mx2 * 70 * o.par;

                var P = o.V.map(function (v) {
                    var p = pr(v, o.n, o.pl, T),
                        a = T * .35 + mx2 * 2 + o.ph,
                        z = p[2],
                        x = p[0] * Math.cos(a) + z * Math.sin(a),
                        z2 = -p[0] * Math.sin(a) + z * Math.cos(a),
                        bb = my2 * 1.6 + .4,
                        y = p[1] * Math.cos(bb) - z2 * Math.sin(bb);

                    z2 = p[1] * Math.sin(bb) + z2 * Math.cos(bb);
                    var f = 1 / (3.2 - z2);
                    return [ox + x * f * S * 1.5, oy + y * f * S * 1.5, z2];
                });

                var c = o.hue ? col2 : col;
                b.lineWidth = o.n > 3 ? 1.1 : 1.4;
                b.shadowColor = "rgba(" + c + ",.9)";
                b.shadowBlur = dk ? 8 : 0;

                o.E.forEach(function (e) {
                    var A = P[e[0]],
                        Bp = P[e[1]],
                        d = (A[2] + Bp[2]) / 2;
                    b.strokeStyle = "rgba(" + c + "," + ((.12 + .2 * (d + 1.5) / 3) * al) + ")";
                    b.beginPath();
                    b.moveTo(A[0], A[1]);
                    b.lineTo(Bp[0], Bp[1]);
                    b.stroke();
                });

                b.fillStyle = "rgba(" + c + "," + (.45 * al) + ")";
                P.forEach(function (p) {
                    b.beginPath();
                    b.arc(p[0], p[1], o.n > 3 ? 1.8 : 2.2, 0, 6.3);
                    b.fill();
                });
            });

            b.shadowBlur = 0;
            T += .004;
        }
        if (!still) requestAnimationFrame(bframe);
    }

    bsize();
    window.addEventListener("resize", function () {
        bsize();
        if (still) bframe();
    });
    bframe();

    var upBtn = $("up");
    if (upBtn) {
        window.addEventListener("scroll", function () {
            upBtn.classList.toggle("show", window.scrollY > 600);
        });

        upBtn.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: still ? "auto" : "smooth"
            });
        };
    }

    var navLinks = document.querySelectorAll("nav ul a");
    if ("IntersectionObserver" in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    navLinks.forEach(function (a) {
                        a.classList.toggle("act", a.getAttribute("href") === "#" + e.target.id);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px" });

        document.querySelectorAll("main section").forEach(function (x) {
            sectionObserver.observe(x);
        });
    }

    var ph = document.querySelector(".ph");
    if (ph && !still && window.matchMedia("(hover: hover)").matches) {
        hero.addEventListener("mousemove", function () {
            ph.style.transform = "perspective(900px) rotateY(" + (tx * 12) + "deg) rotateX(" + (-ty * 9) + "deg)";
        });
        hero.addEventListener("mouseleave", function () {
            ph.style.transform = "";
        });
    }

})();