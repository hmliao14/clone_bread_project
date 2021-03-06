import React, {Component} from 'react'
import DOMPurify from 'dompurify';
import InputFormatHint from './input_format_hint'

class DonationForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      commentChecked: false,
      inputError: false,
      inputErrorMsg: null,
    }
  }

  onSubmit=(e)=>{
    e.preventDefault();
    this.sanitizeInput(this.form);
    this.verifyInput(this.form.suggestedAmount || this.form.customAmount);
  }

  sanitizeInput(form){
    form.suggestedAmount = (DOMPurify.sanitize(form["donation_suggested_amount"].value) + "").trim();
    form.customAmount = (DOMPurify.sanitize(form["donation_custom_amount"].value) + "").trim();
    form.comment = (DOMPurify.sanitize(form["donation_comment"].value) + "").trim();
    form.donationType = (DOMPurify.sanitize(form["donation_type"].value) + "").trim();
  }

  verifyInput(donateAmt){
    let error = "";
    let donateParts = donateAmt.split('.');
    donateParts[0] = donateParts[0].replace(/,/g, "");
    if(!donateAmt){
      error = "Donation amount cannot be empty.";
    }
    else if(donateParts.length > 2) {
      error = "Only one decimal is allowed.";
    }
    else if(donateParts.length === 2){
      if(donateParts[1].indexOf(',') !== -1){
        error = "Comma(s) can only be used before the decimal.";
      }
    }
    let filteredStr = donateParts.join('.');
    if(/^(\d*\.?\d{1,2})$/.test(filteredStr)) {
      //valid input format
      const donationAmount = donateParts[1] ? this.formatNum(donateParts[0]) + '.' + donateParts[1] : this.formatNum(donateParts[0]);
      const comment = this.form.comment ? `\n\nHeres the comment you wrote:\n${this.form.comment}` : "";
      const thankYouMsg = `Thank you for donating a ${this.form.donationType} payment of $${donationAmount}. This is just a demo. Please consider donating at The Bread Project's original site.${comment}`;
      alert(thankYouMsg);
    }
    else if(!error){
      error = "Please input amount in the correct format.";
    }

    if(error) {
      this.setState({
        inputError : true,
        inputErrorMsg : error,
      })
    } else {
      this.setState({
        inputError : false,
        inputErrorMsg : null,
      });
      // output the correct formated amount in the input box if no error
      if(this.form.customAmount){
        this.form["donation_custom_amount"].value = filteredStr;
      }
    }
  }

  // format donation amount to have a comma every 4th digit
  formatNum(str){
    let formatedNum = "";
    for(let count = 0; count < str.length; count++){
      if(count%3 === 0 && count !== 0){
        formatedNum = ',' + formatedNum;
      }
      formatedNum = str[str.length-1-count] + formatedNum;
    }
    return formatedNum;
  }

  onChangeCommentBox =(e)=>{
    this.setState({
      commentChecked: !this.state.commentChecked,
    },()=>{
      if(this.state.commentChecked) this.commentInput.focus();
    })
  }

  clearOtherInputBox=(e)=>{
    if(e.target.tagName === 'LABEL'){
      this.customAmountBox.value='';
    }else{
      let inputs = this.suggestedBox.getElementsByTagName('input');
      for(let input of inputs){
        input["checked"] = false;
      }
    }
  }

  adjustInputHeight=(e)=>{
    let input = e.target;
    input.style.height = input.scrollHeight + 'px';
  }

  render(){
    const suggested_amount = [10,25,50,100,250,500];
    const suggested_amount_divs = suggested_amount.map((amount,i)=>{
      return(
        <div className="box_input col-4" key={`${amount}-${i}`}>
          <input type="radio" id={`suggested_amount_${i}`} name="donation_suggested_amount" value={amount}/>
          <label htmlFor={`suggested_amount_${i}`} onClick={this.clearOtherInputBox}>
            $ {amount}
          </label>
        </div>
      )
    })

    return(
      <div className="donation_form box_shadow_bg col col-lg-10 mx-auto">
        <form ref={form=>{this.form = form}} action="#" method="post" onSubmit={this.onSubmit}>
          <div className="h5">Choose amount</div>
          <div className="donation_form_body">
            <div ref={(div)=>{this.suggestedBox = div}} className="suggested_amount_boxes row">
              {suggested_amount_divs}
            </div>
            <div className="custom_amount_box">
              <label htmlFor="donation_custom_amount">$</label>
              <input ref={(input)=>{this.customAmountBox = input}} type="numeric" onFocus={this.clearOtherInputBox} id="donation_custom_amount"/>
            </div>
            <div className={this.state.inputError ? "inputErrorBox" : "hidden inputErrorBox"}>
              {this.state.inputErrorMsg || ""}
              <InputFormatHint/>
            </div>
            <div className="comment_checkbox text-left">
              <input type="checkbox" id="comment_checkbox" checked={this.state.commentChecked} onChange={this.onChangeCommentBox}/>
              <label htmlFor="comment_checkbox">Write us a comment</label>
            </div>
            <div className="comment">
              <textarea name="donation_comment" ref={(input)=>{this.commentInput = input}} onChange={this.adjustInputHeight} className={this.state.commentChecked ? '' : 'hidden'} placeholder="Your comment"></textarea>
            </div>
            <div className="donation_type_box">
              <input type="radio" id='one_time_donation' defaultChecked name="donation_type" value="one time"/>
              <label htmlFor='one_time_donation'>One-time</label>
              <input type="radio" id='monthly_donation' name="donation_type" value="monthly"/>
              <label htmlFor='monthly_donation'>Monthly</label>
            </div>
            <input type="submit" className="btn" value="Donate"/>
          </div>
        </form>
      </div>
    )
  }
}

export default DonationForm;
