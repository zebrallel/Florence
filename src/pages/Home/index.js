import './style.scss'

import React, { Component } from 'react'
import { Carousel } from 'react-responsive-carousel'
import NavBar from 'components/NavBar'
import Header from 'components/Header/index'
import { notification } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './action'
import { URL_LOGIN } from '../../utils/urls'
import Cookies from 'js-cookie'
import News from './News/News'
import Compare from './Compare/Compare'
import Footer from '../../components/Footer/Footer'
import Tip from './Tip/Tip'
import { withRouter } from 'react-router-dom'

const tips = [
    {
        title: '关于原油期货上市交易有关事项的通知',
        url: 'http://www.ine.cn/news/notice/911319799.html?from=timeline&isappinstalled=0'
    }
]

class Home extends Component {
    state = {
        username: '',
        password: ''
    }

    componentDidMount() {
        const { getNews, getNotice } = this.props

        getNews()
        getNotice()
    }

    onLoginHandler = () => {
        const { username, password } = this.state
        const { updateLogin, history } = this.props

        if (!username || !password) {
            return notification.warning({
                message: '用户名或密码不能为空！'
            })
        }

        axios
            .post(URL_LOGIN, {
                customerPhone: username,
                customerPassword: password
            })
            .then(res => {
                if (res.code == 1) {
                    const { data: { token, cwpCustomers } } = res

                    notification.success({
                        message: '登录成功！'
                    })

                    //用户登录信息保存30天
                    Cookies.set('TOKEN', token, { expires: 30 })

                    updateLogin(true, token, cwpCustomers)
                } else {
                    notification.error({
                        message: res.msg
                    })
                }
            })
    }

    gotoLink = link => {
        location.href = link
    }

    renderLogin = () => {
        const { username, password } = this.state
        const { history } = this.props

        return (
            <div className="login">
                <div className="content">
                    <div className="title">登录系统</div>
                    <div className="label">账号:</div>
                    <input
                        className="input"
                        type="text"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={eve => {
                            this.setState({ username: eve.target.value })
                        }}
                    />
                    <div className="label">密码:</div>
                    <input
                        className="input"
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={eve => {
                            this.setState({ password: eve.target.value })
                        }}
                    />
                    <div
                        className="forget"
                        onClick={() => {
                            history.push('/forget')
                        }}
                    >
                        忘记密码
                    </div>
                    <div className="buttons">
                        <div className="left">
                            <button className="btn" onClick={this.onLoginHandler}>
                                登录
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { username, password } = this.state
        const { loginStatus, history, news, notices } = this.props

        return (
            <div className="g-page" id="Home">
                <Header />
                <NavBar />
                {/* <Carousel
                    emulateTouch
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop
                    autoPlay
                    interval={3000}
                    showStatus={false}
                >
                    <img className="banner" src="//ww1.sinaimg.cn/large/ad85cd77gy1g32dcjb60qj20rg08m43n.jpg" alt="" />
                    <img className="banner" src="//ww1.sinaimg.cn/large/ad85cd77gy1g32df8d0x8j20ra0aye1b.jpg" alt="" />
                </Carousel> */}
                {!loginStatus && this.renderLogin()}
                <Tip />
                <div className="propaganda">
                    <div className="item">
                        <div className="title">资金保障</div>
                        <div className="text">资金托管银行</div>
                        <div className="text">封闭管理专款专用</div>
                        <div className="logo logo-1" />
                    </div>
                    <div className="item">
                        <div className="title">交易安全</div>
                        <div className="text">券商监管</div>
                        <div className="text">保障您的交易安全</div>
                        <div className="logo logo-2" />
                    </div>
                    <div className="item">
                        <div className="title">专业风控</div>
                        <div className="text">多级风控管理</div>
                        <div className="text">降低投资风险</div>
                        <div className="logo logo-3" />
                    </div>
                    <div className="item">
                        <div className="title">全新模式</div>
                        <div className="text">全新微交易</div>
                        <div className="text">简单易懂资讯在手</div>
                        <div className="logo logo-4" />
                    </div>
                </div>
                <Compare />
                <div className="news-panel">
                    <News title={'新闻资讯'} news={news} isOutLink />
                    <News
                        title={'最新公告'}
                        news={notices}
                        clickHandler={url => {
                            this.props.history.push(url)
                        }}
                    />
                </div>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { Home } = state

    return Home
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
