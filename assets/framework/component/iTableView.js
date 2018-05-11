/**
 * 滑动模式
 * Horizontal: 水平方向
 * Vertical: 垂直方向
 * @type {ScrollModel}
 */
let ScrollModel = cc.Enum({
    Horizontal: 0,
    Vertical: 1,
});

let CellPoolCache = {};

let iTableView = cc.Class({
    extends: cc.ScrollView,

    editor: {
        menu: "添加框架组件/iTableView",
        inspector: 'packages://iTableView/inspector.js',
    },

    properties: {
        cell: {
            default: null,
            type: cc.Prefab,
            tooltip: 'TableView中需要显示的ItemCell',
        },

        scrollModel: {
            default: 0,
            type: ScrollModel,
            tooltip: '滑动模式',
        },

        layView: {
            default: null,
            visible: false,
            tooltip: '可显示区域的截取节点',
        },

        layTouch: {
            default: null,
            visible: false,
            tooltip: '用户操作的触摸层节点',
        },

        dataSource: {
            default: null,
            visible: false,
            tooltip: 'iTableView的数据源',
        },

        dataCount: {
            default: 0,
            visible: false,
            tooltip: '数据源总数',
        },

        // 是否已经初始化
        _initialize: false,
        // 是否正在延迟初始化
        _delayInitialize: false,

        // 单元池
        _cellPool: null,
        // 单元大小
        _cellSize: null,
        // 单元总数, Scroll下显示的节点数量
        _cellCount: 0,
    },

    onLoad: function() {
        window.kk = this;
    },

    /**
     * 初始化iTableView
     * @Author   Zjw
     * @DateTime 2018-05-11
     * @param    {Number}                 count 需要显示的单元数量
     * @param    {Object}                 data  数据源
     * @return   {void}
     */
    init: function(count, data) {
        this.dataCount = count;
        this.dataSource = data;

        if (this._initialize) {
            if (!this._delayInitialize) {
                this.initTableView();
            }
        } else {
            this.bindEvents();

            if (this.scrollModel === ScrollModel.Horizontal) {
                this.horizontal = true;
                this.vertical = false;
            } else {
                this.horizontal = false;
                this.vertical = true;
            }

            this.layView = this.content.parent;

            if (this.node.getComponent(cc.Widget) || this.layView.getComponent(cc.Widget) || this.content.getComponent(cc.Widget)) {
                this.scheduleOnce(this.initTableView);
                this._delayInitialize = true;
            } else {
                this.initTableView();
            }
            this._initialize = true;
        }
    },

    bindEvents: function() {
        // 监听窗口大小改变事件, 给ScrollBar重定位
        if (this.verticalScrollBar) {
            this.verticalScrollBar.node.on('size-changed', function() {
                this._updateScrollBar(this._getHowMuchOutOfBoundary());
            }, this);
        }
        if (this.horzontalScrollBar) {
            this.horzontalScrollBar.node.on('size-changed', function() {
                this._updateScrollBar(this._getHowMuchOutOfBoundary());
            }, this);
        }

        // 禁止iTableView点击事件向父级传递
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            event.stopPropagation();
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            event.stopPropagation();
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            event.stopPropagation();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            event.stopPropagation();
        });
    },

    initTableView: function() {
        this._delayInitialize = false;

        let name = this.getCellPoolCacheName();
        if (!CellPoolCache[name]) {
            CellPoolCache[name] = new cc.NodePool('itemCell');
        }

        // 设定单元池
        this._cellPool = CellPoolCache[name];
        // 设定单元大小
        this._cellSize = this.getCellSize();
        // 设定每组单元数量
        this._groupCellCount = this.getGroupCellCount();

        // 一共有多少节点
        this._count = Math.ceil(this.dataCount / this._groupCellCount);

        if (this.scrollModel === ScrollModel.Horizontal) {
            this.layView.width = this.node.width;
            this.layView.x = (this.layView.anchorX - this.node.anchorX) * this.layView.width;

            this._cellCount = Math.ceil(this.layView.width / this._cellSize.width) + 1;

            if (this._cellCount > this._count) {
                this._cellCount = this._count;
                this._showCellCount = this._cellCount;
            } else {
                this._showCellCount = this._cellCount - 1;
            }

            this.content.width = this._count * this._cellSize.width;

            // 停止_scrollView滚动
            // todo ...
            // this.stopAutoScroll();
            // this.scrollToLeft();
        } else {
            this.layView.height = this.node.height;
            this.layView.y = (this.layView.anchorY - this.node.anchorY) * this.layView.height;

            this._cellCount = Math.ceil(this.layView.height / this._cellSize.height) + 1;

            if (this._cellCount > this._count) {
                this._cellCount = this._count;
                this._showCellCount = this._cellCount;
            } else {
                this._showCellCount = this._cellCount - 1;
            }

            this.content.height = this._count * this._cellSize.height;

            // 停止_scrollView滚动
            // todo ...
            // this.stopAutoScroll();
            // this.scrollToTop();
        }

        this._minCellIndex = 0;
        this._maxCellIndex = this._cellCount - 1;

        for (let i = 0; i <= this._maxCellIndex; ++i) {
            this.addCell(i);
        };
    },

    /**
     * 初始化触摸层, 用户的所有触摸操作在这里捕获
     * @Author   Zjw
     * @DateTime 2018-05-10
     * @return   {void}
     */
    initTouchLayer: function() {
        let layTouch = this.layTouch = new cc.Node('lay_touch');
        let widget = layTouch.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = widget.bottom = 0;
        widget.left = widget.right = 0;
        widget.isAlignOnce = false;
        layTouch.parent = this.layView;

        let self = this;
        let touchListener = this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            ower: layTouch,
            mask: this.findMaskParent(layTouch),
            onTouchBegan: function(touch, ev) {
                let pos = touch.getLocation();
                let node = this.ower;

                if (node._hitTest(pos, this)) {
                    self.onTouchBegan(touch);
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, ev) {
                self.onTouchMoved(touch);
            },
            onTouchEnded: function(touch, ev) {
                self.onTouchEnded(touch);
            },
        });

        if (cc.sys.isNative) {
            touchListener.retain();
        };
        // 加入到事件管理器中
        cc.eventManager.addListener(touchListener, layTouch);
    },

    findMaskParent: function(node) {
        let i = 0,
            curr = node;

        while (curr && cc.Node.isNode(curr)) {
            curr = curr._parent;
            index++;

            if (curr.getComponent(cc.Mask)) {
                return {
                    index: index,
                    node: curr
                }
            }
        }
        return null;
    },

    onTouchBegan: function(ev) {
        if (this.scrollModel === ScrollModel.Horizontal) {
            this.horizontal = false;
        } else {
            this.vertical = false;
        }
    },

    onTouchMoved: function(ev) {
        if (this.horizontal === this.vertical) {
            let startL = ev.getStartLocation();
            let l = ev.getLocation();
            if (this.scrollModel === ScrollModel.Horizontal) {
                if (Math.abs(l.x - startL.x) <= 7) {
                    return;
                }
                this.horizontal = true;
            } else {
                if (Math.abs(l.y - startL.y) <= 7) {
                    return;
                }
                this.vertical = true;
            }
        }
    },

    onTouchEnded: function(ev) {
        if (this.scrollModel === ScrollModel.Horizontal) {
            this.horizontal = true;
        } else {
            this.vertical = true;
        }
    },

    // ############# ItemCell相关 #############

    addCell: function(idx) {
        let cell = this.getCell();
        this.setCellAttr(cell, idx);
        this.setCellPosition(cell, idx);
        cell.parent = this.content;
        this.initCell(cell);
    },

    initCell: function(cell, reload) {
        let tag = cell.tag * cell.childrenCount;
        for (let i = 0; i < cell.childrenCount; ++i) {
            let node = cell.children[i];
            let itemCell = node.getComponent('itemCell');
            if (itemCell) {
                itemCell._cellInit_(this);
                itemCell.init(tag + i, this.dataSource, reload, [cell.tag, i]);
            }
        }
    },

    setCellAttr: function(cell, idx) {
        cell.setSiblingIndex(idx >= cell.tag ? this._cellCount : 0);
        cell.tag = idx;
    },

    setCellPosition: function(node, idx) {
        if (this.scrollModel === ScrollModel.Horizontal) {
            if (idx === 0) {
                node.x = -this.content.width * this.content.anchorX + node.width * node.anchorX;
            } else {
                node.x = this.content.getChildByTag(idx - 1).x + node.width;
            }
            node.y = (node.anchorY - this.content.anchorY) * node.height;
        } else {
            if (idx === 0) {
                node.y = this.content.height * (1 - this.content.anchorY) - node.height * (1 - node.anchorY);
            } else {
                node.y = this.content.getChildByTag(idx - 1).y - node.height;
            }
            node.x = (node.anchorX - this.content.anchorX) * node.width;
        }
    },

    getCell: function() {
        let cell;
        if (this._cellPool.size() == 0) {
            cell = cc.instantiate(this.cell);

            let node = new cc.Node;
            node.anchorX = node.anchorY = 0.5;

            let capacity = 0;
            if (this.scrollModel === ScrollModel.Horizontal) {
                node.width = cell.width;
                node.height = this.content.height;

                let len = Math.floor(this.content.height / cell.height);
                for (let i = 0; i < len; i++) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.x = (cell.anchorX - 0.5) * cell.width;
                    cell.y = node.height / 2 - cell.height * (1 - cell.anchorY) - capacity;
                    capacity += cell.height;
                    cell.parent = node;
                    cell = null;
                }
            } else {
                node.width = this.content.width;
                node.height = cell.height;

                let len = Math.floor(this.content.width / cell.width);
                for (let i = 0; i < len; i++) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.y = (cell.anchorY - 0.5) * cell.height;
                    cell.x = -node.width / 2 - cell.width * cell.anchorX + capacity;
                    capacity += cell.width;
                    cell.parent = node;
                    cell = null;
                }
            }
            this._cellPool.put(node);
        };
        cell = this._cellPool.get();
        return cell;
    },

    getCellSize: function() {
        let cell = this.getCell();
        this._cellPool.put(cell);
        return cell.getContentSize();
    },

    getGroupCellCount: function() {
        let cell = this.getCell();
        this._cellPool.put(cell);
        return cell.childrenCount;
    },

    getCellPoolCacheName: function() {
        if (this.scrollModel === ScrollModel.Horizontal) {
            return this.cell.name + 'h' + this.content.height;
        } else {
            return this.cell.name + 'w' + this.content.width;
        }
    },
});