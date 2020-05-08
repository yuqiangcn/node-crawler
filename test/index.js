const fetch = require("../fetch");
const fs = require("fs");
const { Readable } = require("stream");

const start = 67491;
const end = 111393;
// const end = 67494;

getData(start, end);

// 爬取单页数据
async function getData(start, end) {
  let str = "";
  let newData = "";
  for (var i = start; ~~i !== end; ) {
    // console.log(`loading ${i}`);
    // var res = await fetch({
    //   url: `https://tech.antfin.com/api/docs/2/${i}/content?language=zh&_input_charset=utf-8`,
    // });
    // var newData = JSON.parse(res.buffer.toString());
    // str += `<h1>${newData.title}</h1>` + newData.content;
    // console.log(`loaded ${i}, ${newData.title}`);
    // console.log(`loaded ${JSON.stringify(newData.pageContext)}`);

    async function get() {
      console.log(`loading ${i}`);
      var res = await fetch({
        url: `https://tech.antfin.com/api/docs/2/${i}/content?language=zh&_input_charset=utf-8`,
      });
      newData = JSON.parse(res.buffer.toString());

      console.log(`loaded ${i}, ${newData.title}`);
      console.log(`loaded ${JSON.stringify(newData.pageContext)}`);
    }
    await get();
    try {
      i = newData.pageContext[1].pageId;
      str += `<h1>${newData.title}</h1>` + newData.content;

      const buffer = new Buffer(img_string);

      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(buffer);
      readable.push(null);
    } catch (e) {
      console.log(`出错了 ！！！ ${i} , ${newData.title}`);
      // debugger;
      await get();
    }
  }

  const destPath = "./a.html";

  const buffer = Buffer.from(str);
  const readStream = new Readable();
  readStream._read = () => {}; // _read is required but you can noop it
  readStream.push(buffer);

  const writeStream = fs.createWriteStream(destPath);

  readStream.on("data", function (chunk) {
    // 当有数据流出时，写入数据
    if (writeStream.write(chunk) === false) {
      // 如果没有写完，暂停读取流
      readStream.pause();
    }
  });

  writeStream.on("drain", function () {
    // 写完后，继续读取
    readStream.resume();
  });

  readStream.on("end", function () {
    // 当没有数据时，关闭数据流
    writeStream.end();
  });
}
