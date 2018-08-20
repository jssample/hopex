import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { classNames, Patterns, _, isEqual } from '@utils'
import * as styles from './InputNumber.less'

function scientificToNumber(num) {
  var str = num.toString();
  var reg = /^(\d+)(e)([\-]?\d+)$/;
  var arr, len,
    zero = '';

  /*6e7或6e+7 都会自动转换数值*/
  if (!reg.test(str)) {
    return num;
  } else {
    /*6e-7 需要手动转换*/
    arr = reg.exec(str);
    len = Math.abs(arr[3]) - 1;
    for (var i = 0; i < len; i++) {
      zero += '0';
    }

    return '0.' + zero + arr[1];
  }
}

export default class View extends Component {

  componentWillUnmount() {
    this.interval && clearTimeout(this.interval)
  }

  rules = (value) => {
    let { step = 10, max, min, prec = 0, onChange } = this.props
    if (!_.isNil(value) && !_.isNil(step)) {
      // value=Number(value)
      // step = scientificToNumber(step)
      max = Number(max)
      min = Number(min)
    }

    if (!_.isNil(value) && value !== '') {
      let test1 = !/\.$/.test(value)
      let test2 = /^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$/.test(value)
      if (test1 || test2) {
        if (value < min) value = min
        if (value > max) value = max
        // const v = new BigNumber(value)
        const int = Math.floor(value / step)
        // const floa = v.minus(int * step).valueOf()
        value = int * step
      }

      value = (new BigNumber(value)).toFixed(prec)

      // const posnum = step.split('.')[1].length
      // console.log(value,'------------')
      // if (/[Ee]/.test(value)) {
      //   onChange((new BigNumber(value)).toFixed(posnum))
      // } else {
      //   if(/\./.test(value)){
      //     if(value.toString().split('.')[1].length>posnum){
      //       onChange((new BigNumber(value)).toFixed(posnum))
      //     }else{
      //       onChange(value)
      //     }
      //   }else{
      //     onChange(value)
      //   }
      // }


      onChange(value)
    } else {
      onChange('')
    }
  }

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps
    const { value } = this.props
    if (!isEqual(prevValue, value)) {
      this.rules(value)
    }
  }

  render() {

    let { value = null, step } = this.props
    const {
      className = {}, style = {}
    } = this.props

    const { rules } = this
    step = Number(step)
    // console.log(step)
    return (
      <div
        style={style}
        className={classNames(
          styles.input_number,
          className
        )} >
        <div
          onClick={
            () => {
              if (!_.isNil(value)) {
                let result = Number(value) - step
                // result = result.minus(step)
                rules(result)
              }
            }
          }
        >-
        </div >
        <input value={value} onChange={(e) => {
          if (Patterns.decimalNumber.test(e.target.value) || e.target.value === '') {
            rules(e.target.value.replace('。', '.'))
          }
        }} />
        <div onClick={
          () => {
            if (!_.isNil(value)) {
              let result = Number(value) + Number(step)
              // result = result.plus(step).valueOf()
              rules(result)
            }
          }
        } >+
        </div >
      </div >
    )
  }
}
