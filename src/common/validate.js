export const validator={
	mobile:{
		messages:{
			cn:(field,args)=>{
				return "请输入正确的手机号码";
			}
		},
		validate:value=>{
			return /^[1][34578][0-9]{9}$/.test(value)
		}
	},
	name:{
		messages:{
			cn:field=>{
				return "请填写正确姓名，1~16个字符"
			}
		},
		validate:value=>{
			return /^[\u4e00-\u9fa5a-zA-Z\.\s]{1,16}$/.test(value)
		}
	},
	telephone:{
		messages:{
			cn:field=>'请填写正确联系电话，7~13个数字'
		},
		validate:value=>{
			return /^([1][34578][0-9]{9}| [0-9]{8} | [0-9]{12} | [0-9]{13})$/.test(value)
		}
	},
	
}