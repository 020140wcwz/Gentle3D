var React = require('react');

module.exports = React.createClass({
  propTypes: {
    pid: React.PropTypes.String,
    uploadModalConfig: React.PropTypes.Object
  },
  getInitialState: function() {
    return {
      pid: this.props.pid || '',
      selectData: '',
      selected: ''
    };
  },
  componentWillReceiveProps: function(){
    console.log('!');
    $('#upload').css({ display: 'block' });
  },
  componentWillMount: function(){
    var url = '/admin/selectConfig?entity=3d_show_content';
    var that = this;
    $.get(url, function (data) {
      that.setState({ 
        selectData: data,
        selected: data[0].sort
      })
    })
  },
  createTextarea: function(isHaveTextarea) {
    if(isHaveTextarea == 'true') {
      return <textarea className = 'upload-textarea' id = 'upload-textarea'></textarea>
    }
  },
  setSelect: function(event){
    this.setState({ selected: event.target.value });
  },
  createSelect: function(isHaveSelect) {
    var optionArr = [];
    if(isHaveSelect != 'true') {
      return;
    }
    for (var i = 0; i < this.state.selectData.length; i++) {
      optionArr.push(
        <option value = {this.state.selectData[i].sort}>{this.state.selectData[i].sort}</option>
      )
    }
    return (
      <div className = 'upload-selectPos'>
        <span className = 'upload-selectFont'>选择分类</span>
        <select id = 'upload-select' className = 'upload-select' onChange = { this.setSelect }>
          {optionArr}
        </select>
      </div>
    );
  },
  createUploadModal: function(obj) {
    var fileName = this.props.uploadModalConfig.name;
    return (
      <div>
        <div>
          <span className = 'uploadModal-title'>
            { obj.title }
            <i className = 'fa fa-times' onClick = { this.handeChickCancle }></i>
          </span>
          { this.createSelect(this.props.uploadModalConfig.isHaveSelect) } 
        </div>
        { this.createTextarea( this.props.uploadModalConfig.isHaveTextarea ) }
        <div className = 'uploadModal-button'>
          <span onClick = { this.handeClickUpload }>选择上传图片</span>
          <form name="form1" id = 'frmUploadFile' method = 'POST' action = { obj.url } enctype = "multipart/form-data">
            <input type = 'file' style = {{display: 'none'}}
              id = 'uploadModal-uploadBtn'
              name = { fileName }/>
            <input type = 'button' value = '上传' className = 'uploadModal-sub' onClick = { this.handeChlickSubmit }/>
          </form>
        </div>
      </div>
    );
  },
  handeClickUpload: function() {
    $('#uploadModal-uploadBtn').click();
  },
  handeChlickSubmit: function(event) {
    event.preventDefault();
    var that = this;
    var ajaxUrl = this.props.uploadModalConfig.url;
    var FormObj = new FormData();
    var selfParm = this.props.uploadModalConfig;

    var isNew = selfParm.isNew ? selfParm.isNew : 'null';
    var selectSort = this.state.selected;
    var flag = selfParm.flag ? selfParm.flag : 'null';
    var id = selfParm.id ? selfParm.id : 'null';
    var content = $('#upload-textarea').val() ? $('#upload-textarea').val() : 'null';
    var entity = selfParm.entity ? selfParm.entity : 'null';
    var special = selfParm.special ? selfParm.special: 'null';

    var url = '/admin/' + selfParm.url + '?id=' + id + '&entity=' + entity + '&isNew=' + isNew + '&content=' + content + '&value=' + selectSort + '&flag=' + flag + '&special=' + special;

    FormObj.append('userImg', document.getElementById('uploadModal-uploadBtn').files[0]);

    $.ajax({
      url: url,
      contentType: false,
      data: FormObj,
      processData: false,
      type: 'POST',
      cache: false,
      success: function(){
        that.handeChickCancle();
        if(that.state.pid){
          $('#' + that.state.pid).click();
        }
      },
      error: function(){
        alert('上传失败');
        that.handeChickCancle();
      }
    });
  },
  handeChickCancle: function() {
    var length = $("div[name = 'upload']").length;
    for (var i = 0; i < length; i++) {
      $($("div[name = 'upload']")[i]).css('display', 'none');
    }
  },
  render: function() {
    return (
      <div className = 'uploadModal-position' name = 'upload' id = 'upload'>
        { this.createUploadModal( this.props.uploadModalConfig ) }
      </div>
    );
  }
})