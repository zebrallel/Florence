import './style.scss'
import * as React from 'react'
import { notification } from 'antd'
import { URL_GO_REAL_NAME } from 'utils/urls'
import { connect } from 'react-redux'
import qs from 'query-string'

class Verify extends React.Component {
    state = {
        name: '',
        card: '',
        files: []
    }
    onSubmit = () => {
        const { name, card, files } = this.state
        const { customerId, token } = this.props

        if (!name) {
            return notification.warning({
                message: '真实姓名不得为空！'
            })
        }

        if (!/^\d{15,18}.$/.test(card)) {
            return notification.warning({
                message: '身份证格式有误，请重新输入！'
            })
        }

        if (files.length < 3) {
            return notification.warning({
                message: '请上传全部照片！'
            })
        }

        const fd = new FormData()

        fd.append('file', files[0])
        fd.append('file', files[1])
        fd.append('file', files[2])

        fetch(
            URL_GO_REAL_NAME +
                `?${qs.stringify({
                    client_token: token,
                    customerCardId: card,
                    customerRealName: name,
                    id: customerId
                })}`,
            {
                method: 'POST',
                body: fd
            }
        )
            .then(res => res.json())
            .then(res => {
                if (res.code != 1) {
                    notification.error({
                        message: res.msg
                    })
                } else {
                    notification.success({
                        message: '提交成功！'
                    })

                    this.props.history.goBack()
                }
            })
    }
    onFileInputChange = eve => {
        this.state.files.push(eve.target.files[0])
    }
    render() {
        const { name, card } = this.state
        return (
            <div id="Verify">
                <div className="verify-title">实名认证</div>
                <div className="line">
                    <div className="label">真实姓名</div>
                    <input
                        type="text"
                        className="input"
                        placeholder="请输入真实姓名"
                        maxLength={6}
                        value={name}
                        onChange={eve => {
                            this.setState({
                                name: eve.target.value
                            })
                        }}
                    />
                </div>
                <div className="line">
                    <div className="label">身份证号</div>
                    <input
                        type="text"
                        className="input"
                        placeholder="请输入身份证号码"
                        maxLength={19}
                        value={card}
                        onChange={eve => {
                            this.setState({
                                card: eve.target.value
                            })
                        }}
                    />
                </div>
                <div className="line">
                    <div className="label">身份证正面</div>
                    <input type="file" onChange={this.onFileInputChange} />
                </div>
                <div className="line">
                    <div className="label">身份证反面</div>
                    <input type="file" onChange={this.onFileInputChange} />
                </div>
                <div className="line">
                    <div className="label">手持身份证</div>
                    <input type="file" onChange={this.onFileInputChange} />
                </div>
                <div className="line">
                    <button className="btn" onClick={this.onSubmit}>
                        提交
                    </button>
                </div>
                <div className="warning">客户信息涉及到提款出金，请务必正确填写</div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { Home } = state

    return Object.assign({}, Home)
}

export default connect(mapStateToProps)(Verify)
