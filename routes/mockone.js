const express = require('express')
const router = express.Router()

const Mock = require('mockjs');
const { create } = require('xmlbuilder2');
const yaml = require('js-yaml');
const fs = require('fs');

const convert = require('xml-js');



/*
//执行mock服务
router.get('/api/users',mockone_handler.mockServerHandler)
router.post('/api/users',mockone_handler.mockServerHandler)
router.put('/api/users',mockone_handler.mockServerHandler)
router.delete('/api/users',mockone_handler.mockServerHandler)
*/


router.post('/json/get', (req, res) =>{


    const data = Mock.mock({
        'users|5': [{
          'id|+1': 1,
          'name': '@name',
          'age|18-60': 1,
          'email': '@email',
          'url':req.query.url,
          'method':req.query.method,
          'returns':req.query.returns
        }]
      });
      
      
    
      if(req.query.returns==='json'){
        const jsondata=Mock.mock(data);
        res.json(jsondata);
    
      }
      else if(req.query.returns==='xml'){
        const xmlData = convert.js2xml(data, { compact: true, spaces: 2 });
        res.set('Content-Type', 'application/xml');
        res.send(xmlData);
    
      }
      else if(req.query.returns==='yaml'){
        const yamlData = yaml.dump(data);
        res.set('Content-Type', 'text/yaml');
        res.send(yamlData);
      }
      else if(req.query.returns==='file'){
    
        const jsonData = Mock.mock(data);
      const filePath = 'data.json';
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      res.download(filePath, 'data.json', (err) => {
        if (err) {
          console.error('下载文件时出错：', err);
        }
        fs.unlinkSync(filePath); // 删除临时文件
      });
      }
      else{
    
        const jsondata=Mock.mock(data);
        res.json(jsondata);
    
      }




});


/*
router.post('/mock/json/post',mockone_handler.postjson)
router.post('/mock/json/put',mockone_handler.putjson)
router.post('/mock/json/delete',mockone_handler.deletejson)


router.post('/mock/xml/get',mockone_handler.getxml)
router.post('/mock/xml/post',mockone_handler.postxml)
router.post('/mock/xml/put',mockone_handler.putxml)
router.post('/mock/xml/delete',mockone_handler.deletexml)


router.post('/mock/yaml/get',mockone_handler.getyaml)
router.post('/mock/yaml/post',mockone_handler.postyaml)
router.post('/mock/yaml/put',mockone_handler.putyaml)
router.post('/mock/yaml/delete',mockone_handler.deleteyaml)


router.post('/mock/file/get',mockone_handler.getfile)
router.post('/mock/file/post',mockone_handler.postfile)
router.post('/mock/file/put',mockone_handler.putfile)
router.post('/mock/file/delete',mockone_handler.deletefile)
*/
module.exports = router