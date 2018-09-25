import axios from 'axios';
export default {
	install(Vue, options) {
		var ajaxOption = {
			//'http://192.168.1.243:8021/api/api',线上地址
			//'http://192.168.1.243:8021/',//开发调试地址  

			baseURL:  'http://drugstore.xuhuicn.com:81/api/',
			method: 'post',
			headers: {
				'X-Auth-Token': '123toen'
			},
			url: '',
			data: {}, //请求参数
			params: {}, //跟在url后面的参数	
			// timeout: 5000, //请求超时（毫秒） 
			otherConfig: { //额外的配置
				loadingText: '加载中',
			}
		};
		Vue.prototype.$ajax = function (opts) {
			var option = { ...ajaxOption,
				...opts
			}
			return axios(option).then(res => {
				if (res.data.success) {
					option.success(res.data);
				} else {
					this.$Message.error({
						content: res.data.message + '。错误代码：' + res.data.errCode,
						duration: 3
					});
					option.error(res.data);
				}
			}).catch(res => {
				option.error(res.data);
				if (res.code == "ECONNABORTED") {
					this.$Message.error({
						content: '请求超时！',
						duration: 3
					});
					return false;
				}
				if (res.message == 'Network Error') {
					this.$Message.error({
						content: '网络连接错误！',
						duration: 3
					});
					return false;
				}
				this.$Message.error({
					content: '服务器接口出错,状态码：' + res.response.status + '。',
					duration: 3
				});
			});
		};
	}
};