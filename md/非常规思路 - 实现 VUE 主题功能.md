# 非常规思路 - 实现 VUE 主题功能

在项目中我们会遇到需要实现页面主题的功能，一般实现方式有很多种例如：替换 css 链接 or className， css 原生变量，使用 less.modifyVars， 参数下发等等，但是每一种都是要基于实际业务情况，才能选择具体使用哪一种。

那本文要讲的就是讲的是基于 “诺亚运营平台” 实现的主题功能。

“诺亚运营平台” 是我司针对基于各产品营销类活动所搭建的H5活动页面智能生成系统，页面通过配置所需组件及组件配置项（功能和样式），生成活动页面。

如果想要详细了解 [诺亚运营平台](https://mp.weixin.qq.com/s?__biz=MzIyNjU5OTg0Ng==&mid=2247484533&idx=1&sn=5fc10fccf683d441954fb74646764980&chksm=e86cb2bcdf1b3baa5f6b5a72f735d1b2ef6fc981cef4807e3a271fba03c909e323868eb5b061&mpshare=1&scene=1&srcid=#rd)，可以点击链接查看，因为本文所说实现的主题功能是基于 诺亚运营平 上的功能开发。

注：文章中 NOAH 统一指代：诺亚运营平台

-------------------------
[TOC]


## 需求分析

首先我们先来拆解下需求，几个重要的关键点，分为以下几个部分：

1. NOAH 前端为 VUE 实现；
2. 在 NOAH 配置活动页面，初始化页面时，实现主题一键切换所有组件的样式；
2. 配置页面中的组件，是可以配置对应组件样式，可以覆盖主题样式；
3. 再次点击设置主题，可以覆盖已经设置样式的组件样式；
	
具体实现的效果，见下面图片： 

全局设置主题，改变页面所有组件样式，如下图：

![Alt text](https://imgservices-1252317822.image.myqcloud.com/file/20190701/10cd5d736efa.gif)

组件内部设置组件主题如下图：

<img src="https://imgservices-1252317822.image.myqcloud.com/file/20190701/ecffffbeca2b.png" width="700" />

在了解完需求，我们就来说下具体如何实现。一般对于 VUE 项目，大家一般想到的实现方式就是 theme 参数 通过 props 下发实现。那我们就先来聊下一般正常实现的方式 props 下发实现方式


## 一般实现方式

一般对于 VUE 项目，大家一般想到的实现方式就是 theme 参数 通过 props 下发实现。如下：

### 定义主题

那首先我定义 theme.js 相关参数，如下：

```javascript
const DEFAULT_THEME = {
  primary: '#2F54EB',
  subPrimary: '#D6E4FF',
  error: '#F5222D',
  success: '#52C41A',
  warning: '#FAAD14',
  background: '#FFFFFF',
  text: '#222222'
}
export default {
	DEFAULT: DEFAULT_THEME,
	FIRST: {
		...DEFAULT_THEME,
		background: '#2590ff'
	}
}
```

###  主模块下发 theme 给予组件

接着需要在主模块中，下发 theme 参数，和组件相关配置参数给到组件，点击按钮，切换主题：

```htmlbars
<template>
  <div>
    <div @click="changeTheme">换主题</div>
    <Component 
	    :theme="theme" 
	    ...props  // 业务相关参数
    />
  </div>
</template>

<script>

import theme from 'theme.js'

export default {
	name: "themeChange",
	data() {
		return {
			theme: theme['DEFAULT']
		}
	},
	methods: {
		changeTheme() {
			this.theme = theme['FIRST']
		}
	}
}
</script>
```

### 组件监听 theme 改变组件样式

组件中，获取上级组件传递下来的配置参数及主题参数，并监听 theme 的变化，当发生改变，重置样式参数值为主题样式：

```htmlbars
<template>
  <div>
    <div :style="{ background: config.bgColor }">主题</div>
  </div>
</template>

<script>
import theme from 'theme.js'
const initTheme = theme['DEFAULT']
export default {
	name: "themeSwitch",
	props: {
		theme: {
			type: Object,
			default: () => ({})
		},
		bgColor: {
			type: String,
			default: initTheme.background
		},
		...
	},
	data() {
		return {
			config: {
				bgColor: this.bgColor,
				...
			}
		}
	},
	watch: {
		'theme' (to, from) {
			this.config.bgColor = this.theme.bgColor
		}
	}
}	
</script>
```
**看到这里大家会说，为什么需要在watch 中监听主题的变化，而不是在组件初始化的时候就参数就直接指向主题对应的参数呢？ **

因为在组件里面也是可以改变组件相关样式的，如一开始的需求分析中组件设置配置样式图所示，可以看到在每个组件里面，都会有组件相应配置区域，上述 demo 代码中的 bgColor 参数，既需要点击切换主题可以设置 ，也可以是组件自己设置的，有多个来源（这里不对组件的配置实现做详细展开）；

要做到当设置主题的时候，组件的样式相关参数又是需要被重置到对应的主题色，就需要在 watch 中进行监听 theme 参数的变化，发生变化，重置相应参数，但是这种方式在每个组件都需要有相同代码片段，达到我们的效果，但代码冗余。

**总结下：**

使用上述方式，我们进一步优化，把监听 theme 参数的方法统一封装，这里就会又一个问题，每个组件对应颜色的参数 是不可定的，且参数层级也是不可以定的，几乎每个组件需要维护一整个变量数组，这样定义的规则会相对复杂，维护成本过高，且开发会加大重复开发量，极易弄错。

很显然这样的实现方式并不是一种很好的方法，那要如何实现？


## 最终实现方式

在尝试上面的方式之后，我在想我的思路是否正确，是不是切入角度有点问题，那我们换一个角度去切入。

### 配置参数入手

**当我发现页面整个 this.componentList 参数 ( 里面存储了所有组件的相关配置 ) 我是可以拿到的时候，我是不是可以从数据入手？**

ok，说到这里，那其实思路就出现了,  this.componentList 里面的参数规则：

```javascript
[
	{
		componentName: 'xx',
		config: {
			color: 'xxx',
			background: 'xxx',
			...
		}
	},
	...
]
```

我们会发现，在 NOAH 开发组件的时候就已经是把颜色相关参数提取到配置里面了，那也就是说我修改配置参数的值，其实就可以达到设置主题的效果？因为所有组件的配置参数都是由this.componentList 参数下发的。

### 参数给予特殊标识

定义 theme.js 相关参数，和上面一致，故不在多说，主要做的就是，在组件中，我把相关参数进行修改改为有特殊标示的参数， 如下：

```htmlbars
<template>
  <div>
    <div :style="{ background: this['bgColor.t.background']}">主题</div>
  </div>
</template>

<script>
import theme from 'theme.js'
const initTheme = theme['DEFAULT']

export default {
	name: "themeSwitch",
	props: {
		'bgColor.t.background': {  // .t.: 为特殊标识 ；background: 为主题里面对应的字段名 background: '#FFFFFF'
			type: String,
			default: initTheme.background
		}
	}![Alt text](./gifhome_1440x1025.gif)

}	
</script>
```
### 遍历参数替换特殊标识参数值

当点击主题切换的时候，会去遍历 this.componentList 参数，修改有特殊标示的参数为新主题对应的参数，代码如下：

```javascript

/*
* 根据主题重制componentsConfig
* @method changeTheme
* */
changeTheme () {
	this.theme = theme['FIRST']
	this.componentList.forEach(component => {
	    this._setThemeChangeConfig(component.config || {})
	})
},
_setThemeChangeConfig (obj) {
    Object.keys(obj).map(name => {
        if (Object.prototype.toString.call(obj[name]) === '[Object Object]') {
            this._setThemeChangeConfig(obj)
        } else {
            const themeColorArr = name.match(/\.t\.(\S*)/)
            if (themeColorArr && this.isThemeColorName(themeColorArr[1])) {
                this.$set(obj, name, this.theme[themeColorArr[1]])
            }
        }
    })
},
/*
* 判断颜色name是否在主题里面
* @method isThemeColorName
* */
isThemeColorName (name) {
	let has = false
	Object.keys(this.theme).forEach((paramsName) => {
		if (paramsName === name) has = true
	})
	return has
}
```  
最终实现 “诺亚运营平台” 需要的主题切换的效果。

该实现方式带来的好处：

1. 不对前台代码进行修改，修改完全处在页面配置区域；
2.  对组件配置几乎无侵入性，组件只需要修改样式相关参数带上特殊标示既可，移除主题功能，也可以正常使用；
3.  参数无需一层层下发，易于维护；



## 总结

从常见的解决设置主题的方式，到 NOAH 系统主题设置的实现，其实会发现，有的时候我们需要了解业务特性去寻找解决方法，去找到最适合的方案。针对不同项目，可能会有各种不同的实现方式，但是唯一标准都是为了项目的可维护性，扩展性，以及接入复杂度。NOAH 目前的实现方案，个人认为，不失为一个好的解决方案。





