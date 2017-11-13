var ScrollBuilder

;(function() {
    ScrollBuilder = function(selector, options) {
        this.options = {
            data: [],
            sideCount: 1,
            cell_font: 22,
            width: '100%',
            height: '100px',
            snappedComplete: function(index, elem) {}
        }

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.options[key] = options[key]
            }
        }

        this.options.selector = selector

        var self = this
        var sideCount = this.options.sideCount
        var data = this.options.data

        var scrollElem = $(selector)

        console.log(scrollElem)

        var container = document.createElement('div')
        container.className = 'scroll-container'
        container.style.height = this.options.height

        var content = document.createElement('div')
        content.className = 'scroll-content'
        content.style.height = this.options.height

        var overlay = document.createElement('div')
        overlay.className = 'scroll-container overlay'
        overlay.style.height = this.options.height

        container.append(content)
        scrollElem.append(container)
        scrollElem.append(overlay)

        if (this.options.width === '100%') {
            var width = scrollElem.parent().width()
        } else {
            var width = parseInt(this.options.width, 10)
        }

        // Content Generator
        var size = width / (sideCount * 2 + 1)
        for (var i = 0; i < sideCount; i++) {
            var item = document.createElement('div')
            item.className = 'scroll-cell empty'
            item.innerHTML = 1
            item.style.width = size + 'px'
            item.style.height = this.options.height
            item.style.fontSize = this.options.cell_font + 'px'
            item.style.lineHeight = this.options.height
            content.append(item)
        }

        for (var i = 0; i < data.length; i++) {
            item = document.createElement('div')
            item.className = 'scroll-cell'
            item.innerHTML = data[i]
            item.style.width = size + 'px'
            item.style.height = this.options.height
            item.style.fontSize = this.options.cell_font + 'px'
            item.style.lineHeight = this.options.height
            content.append(item)
        }

        for (var i = 0; i < sideCount; i++) {
            item = document.createElement('div')
            item.className = 'scroll-cell empty'
            item.innerHTML = 1
            item.style.width = size + 'px'
            item.style.height = this.options.height
            item.style.fontSize = this.options.cell_font + 'px'
            item.style.lineHeight = this.options.height
            content.append(item)
        }

        $(container).css('width', size * (sideCount * 2 + 1) + 'px')
        $(overlay).css('width', size * (sideCount * 2 + 1) + 'px')
        $(content).css('width', (data.length + sideCount * 2) * size + 'px')

        // Initialize Scroller
        var scroller = new Scroller(render, content, {
            snapping: true,
            scrollingY: false,
            snapped: function() {
                var pos = scroller.getSnappedXPos()
                var elem = $(content)
                    .children()
                    .eq(pos + sideCount)
                self.options.snappedComplete(pos + sideCount, elem)
            }
        })

        var rect = container.getBoundingClientRect()

        console.log(
            rect.left +
                ' ' +
                container.clientLeft +
                ' ' +
                rect.top +
                ' ' +
                container.clientTop
        )
        console.log(
            container.clientWidth +
                ' ' +
                container.clientHeight +
                ' ' +
                content.offsetWidth +
                ' ' +
                content.offsetHeight
        )

        scroller.setPosition(
            rect.left + container.clientLeft,
            rect.top + container.clientTop
        )
        scroller.setDimensions(
            container.clientWidth,
            container.clientHeight,
            content.offsetWidth,
            content.offsetHeight
        )
        scroller.setSnapSize(size, this.options.height)

        // Event Handler

        if ('ontouchstart' in window) {
            container.addEventListener(
                'touchstart',
                function(e) {
                    // Don't react if initial down happens on a form element
                    if (e.target.tagName.match(/input|textarea|select/i)) {
                        return
                    }

                    scroller.doTouchStart(e.touches, e.timeStamp)
                    e.preventDefault()
                },
                false
            )

            document.addEventListener(
                'touchmove',
                function(e) {
                    scroller.doTouchMove(e.touches, e.timeStamp)
                },
                false
            )

            document.addEventListener(
                'touchend',
                function(e) {
                    scroller.doTouchEnd(e.timeStamp)
                },
                false
            )
        } else {
            var mousedown = false

            container.addEventListener(
                'mousedown',
                function(e) {
                    // Don't react if initial down happens on a form element
                    if (e.target.tagName.match(/input|textarea|select/i)) {
                        return
                    }

                    scroller.doTouchStart(
                        [
                            {
                                pageX: e.pageX,
                                pageY: e.pageY
                            }
                        ],
                        e.timeStamp
                    )

                    mousedown = true
                },
                false
            )

            document.addEventListener(
                'mousemove',
                function(e) {
                    if (!mousedown) {
                        return
                    }

                    scroller.doTouchMove(
                        [
                            {
                                pageX: e.pageX,
                                pageY: e.pageY
                            }
                        ],
                        e.timeStamp
                    )

                    mousedown = true
                },
                false
            )

            document.addEventListener(
                'mouseup',
                function(e) {
                    if (!mousedown) {
                        return
                    }

                    scroller.doTouchEnd(e.timeStamp)

                    mousedown = false
                },
                false
            )
        }

        this.__scroller = scroller

        return this
    }

    var members = {
        updateData: function(data) {
            var self = this
            console.log(self.options.selector)
            console.log(self.options)

            var selector = self.options.selector

            var container = $(selector).find('.scroll-container')
            var content = $(selector).find('.scroll-content')
            var overlay = $(selector).find('.overlay')
            var sideCount = self.options.sideCount

            content.html('')

            if (this.options.width === '100%') {
                var width = $(selector)
                    .parent()
                    .width()
            } else {
                var width = parseInt(this.options.width, 10)
            }

            // Content Generator
            var size = width / (sideCount * 2 + 1)
            for (var i = 0; i < sideCount; i++) {
                var item = document.createElement('div')
                item.className = 'scroll-cell empty'
                item.innerHTML = 1
                item.style.width = size + 'px'
                item.style.height = this.options.height
                item.style.fontSize = this.options.cell_font + 'px'
                item.style.lineHeight = this.options.height
                content.append(item)
            }

            for (var i = 0; i < data.length; i++) {
                item = document.createElement('div')
                item.className = 'scroll-cell'
                item.innerHTML = data[i]
                item.style.width = size + 'px'
                item.style.height = this.options.height
                item.style.fontSize = this.options.cell_font + 'px'
                item.style.lineHeight = this.options.height
                content.append(item)
            }

            for (var i = 0; i < sideCount; i++) {
                item = document.createElement('div')
                item.className = 'scroll-cell empty'
                item.innerHTML = 1
                item.style.width = size + 'px'
                item.style.height = this.options.height
                item.style.fontSize = this.options.cell_font + 'px'
                item.style.lineHeight = this.options.height
                content.append(item)
            }

            $(container).css('width', size * (sideCount * 2 + 1) + 'px')
            $(overlay).css('width', size * (sideCount * 2 + 1) + 'px')
            $(content).css('width', (data.length + sideCount * 2) * size + 'px')

            // Initialize Scroller
            var scroller = self.__scroller

            var containerElem = $(container)[0]
            var contentElem = $(content)[0]

            var rect = containerElem.getBoundingClientRect()

            console.log(
                rect.left +
                    ' ' +
                    containerElem.clientLeft +
                    ' ' +
                    rect.top +
                    ' ' +
                    containerElem.clientTop
            )
            console.log(
                containerElem.clientWidth +
                    ' ' +
                    containerElem.clientHeight +
                    ' ' +
                    contentElem.offsetWidth +
                    ' ' +
                    contentElem.offsetHeight
            )

            self.__scroller.setPosition(
                rect.left + containerElem.clientLeft,
                rect.top + containerElem.clientTop
            )
            self.__scroller.setDimensions(
                containerElem.clientWidth,
                containerElem.clientHeight,
                contentElem.offsetWidth,
                contentElem.offsetHeight
            )
            self.__scroller.setSnapSize(size, this.options.height)
        }
    }

    // Copy over members to prototype
    for (var key in members) {
        ScrollBuilder.prototype[key] = members[key]
    }
})()
