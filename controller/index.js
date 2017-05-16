/**
 * Author：zhoushuanglong
 * Time：2017/3/10
 * Description：index
 */

var request = require('superagent');

let headerFooter = require('../models/header-footer'),
	imgurl = require('../models/imgurl'),
	category = require('../models/category'),
	production = require('../models/production'),
	link = require('../models/link');

const proxyUrl = 'http://www.linekong.com';


exports.index = function (req, res) {
	
	/*----------lang----------*/
	let pro,
		lind;
	if (req.cookies.lang == 'hant') {
		pro = production.hant;
		lind = link.hant;
	} else {
		pro = production.hans;
		lind = link.hans;
	}
	
	/*----------production----------*/
	/*pc*/
	let proStr = '';
	for (let i in pro) {
		proStr += `<div class="pro-item clearfix">`;
		let m = pro[i].con,
			mStr = '';
		if (m.length == 0) {
			mStr = '<p class="no-con-tips">精彩内容暂未开启敬请期待</p>';
		} else {
			for (let a in m) {
				let n = m[a].con;
				mStr += `<dl><dt>${m[a].title}</dt>${ddStr(n)}</dl>`
			}
		}
		
		proStr += `${mStr}</div>`;
	}
	function ddStr(n) {
		var nStr = '';
		for (let b in n) {
			let o = n[b];
			let attr = o.url == '' ? `class="nohref"` : `target="_blank" href="${o.url}"`;
			nStr += `<dd><a ${attr}>${o.text}
${o.isnew == 1 ? '<span class="isnew"></span>' : ''}
${o.ishot == 1 ? '<span class="ishot"></span>' : ''}
${o.istest == 1 ? '<span class="istest"></span>' : ''}
</a></dd>`;
		}
		return nStr;
	}
	
	/*mobile*/
	let mobileStr = '';
	for (let i in pro) {
		mobileStr += `<div class="pro-item clearfix">`;
		let m = pro[i].con,
			mStr = '';
		if (m.length == 0) {
			mStr = '<p class="no-con-tips">精彩内容暂未开启敬请期待</p>';
		} else {
			let x = 0, y = 0;
			for (let a in m) {
				if (x >= 8 || y >= 8) {
					break;
				} else {
					let n = m[a].con;
					x++;
					for (let b in n) {
						if (y >= 8) {
							break;
						} else {
							let attr = n[b].url == '' ? `class="nohref"` : `target="_blank" href="${n[b].url}"`;
							mStr += `<a ${attr}>${n[b].text}</a>`;
							y++;
						}
					}
					
				}
			}
		}
		mobileStr += `${mStr}${pro[i].url == '' ? '' : `<a target="_blank" href="${pro[i].url}">MORE</a>`}</div>`;
	}
	
	/*----------link----------*/
	let linStr = `<div class="link clearfix">`;
	for (let i in lind) {
		let m = lind[i];
		linStr += `<dl><dt>${m.title}</dt>`;
		for (let a in m.con) {
			let n = m.con[a];
			linStr += `<dd><a target="_blank" href="${n.url}">${n.title}</a></dd>`;
		}
		linStr += `</dl>`;
	}
	linStr += `</div>`;
	
	if (req.cookies.lang == 'hant') {
		res.render('index', {
			lang: 'hant',
			headerFooter: headerFooter.hant,
			imgurl: imgurl,
			category: category.hant,
			product: production.hant,
			productstr: {
				pc: proStr,
				mobile: mobileStr
			},
			linkStr: linStr
		});
	} else {
		res.render('index', {
			lang: 'hans',
			headerFooter: headerFooter.hans,
			imgurl: imgurl,
			category: category.hans,
			product: production.hans,
			productstr: {
				pc: proStr,
				mobile: mobileStr
			},
			linkStr: linStr
		});
	}
	
};

exports.banner = function (req, res) {
	let apiUrl = '';
	
	if (req.cookies.lang == 'hant') {
		apiUrl = '/api_trad_figure';
	} else {
		apiUrl = '/api_simple_figure';
	}
	
	let promise = new Promise(function (resolve, reject) {
		request
			.get(proxyUrl + apiUrl)
			.end(function (err, res) {
				if (err) reject(err);
				if (res) resolve(JSON.parse(res.text));
			});
	});
	
	promise.then(function (data) {
		let str = '';
		for (let i in data) {
			str += `<div class="swiper-slide">
<a target="_blank" href="${data[i].url }" 
class="banner-img" data-little="${imgurl + data[i].filePath2}" 
data-middle="${imgurl + data[i].filePath3}" 
data-large="${imgurl + data[i].filePath}"></a></div>`
		}
		
		res.json({
			success: true,
			data: str
		});
	}, function (err) {
		console.log(err);
	});
	
};

exports.hot = function (req, res) {
	let apiUrl = '';
	if (req.cookies.lang == 'hant') {
		apiUrl = '/api_trad_hot';
	} else {
		apiUrl = '/api_simple_hot';
	}
	
	let promise = new Promise(function (resolve, reject) {
		request
			.get(proxyUrl + apiUrl)
			.query({page: req.query.page})
			.end(function (err, res) {
				if (err) {
					reject(err);
				}
				if (res) {
					resolve(JSON.parse(res.text));
				}
			});
	});
	
	promise.then(function (data) {
		
		/*pc html*/
		let pcHtml = '',
			bigImg = data[0],
			str = `<div class="hot-left"><div class="hot-item" style="background-image: url(${imgurl + bigImg.filePath})"><div class="item-mask"><div class="item-con">
<h3>${bigImg.title}</h3><h4>${bigImg.roleName}</h4><span></span><p>${bigImg.roleServer}</p><a target="_blank" href="${bigImg.url}"></a></div></div></div></div>
<div class="hot-right">`;
		for (let i in data) {
			if (i != 0) {
				var classEle = '';
				if (i % 2 == 0) {
					classEle = 'double';
				}
				
				let littleImg = data[i];
				str += `<div class="right-con ${classEle}"><div class="hot-item" style="background-image: url(${imgurl + littleImg.filePath2})"><div class="item-mask"><div class="item-con">
<h3>${littleImg.title}</h3><h4>${littleImg.roleName}</h4><span></span><p>${littleImg.roleServer}</p><a target="_blank" href="${littleImg.url}"></a></div></div></div></div>`
			}
		}
		pcHtml = `${str}<div>`;
		
		
		/*mobile html*/
		let mobileHtml = `<div class="swiper-container hot-mobile"><div class="swiper-wrapper"><!--<div class="swiper-slide">不循环播放时添加此div</div>-->`;
		for (let i in data) {
			let littleImg = data[i];
			mobileHtml += `<div class="swiper-slide"><a target="_blank" style="background-image: url(${imgurl + littleImg.filePath2})" href="${littleImg.url}"></a></div>`
		}
		mobileHtml += `<!--<div class="swiper-slide">不循环播放时添加此div</div>--></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>`;
		
		res.json({
			success: true,
			data: {
				pages: Math.ceil(data[0].keyfield / 5),
				pc: pcHtml,
				mobile: mobileHtml
			}
		});
	}, function (err) {
		console.log(err);
	});
};


