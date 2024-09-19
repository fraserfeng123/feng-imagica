const templates = [
  {
    id: 1,
    name: "News Portal",
    type: "desktop",
    thumbnail: "https://picsum.photos/200/300?random=2",
    code: `
<html lang=&quot;en&quot;>
<head>
<meta charset=&quot;UTF-8&quot;>
<meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;>
<title>科技新闻详情页</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
    }
    header {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 10px 0;
    }
    nav {
        background-color: #444;
        height: 30px; /* 设置导航栏高度为30px */
        text-align: center;
        line-height: 30px; /* 设置导航栏文字行高为30px */
        padding: 5px 0;
    }
    nav a {
        color: #fff;
        text-decoration: none;
        margin: 0 10px;
    }
    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
        color: #333;
    }
    p {
        color: #555;
        line-height: 1.6;
    }
    .news-image {
        max-width: 100%;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .publish-time {
        color: #777;
        font-style: italic;
    }
</style>
</head>
<body>
    <header>
        <h1>科技新闻详情</h1>
    </header>
    <nav>
        <a href=&quot;#&quot;>首页</a>
        <a href=&quot;#&quot;>科技</a>
        <a href=&quot;#&quot;>人文</a>
        <a href=&quot;#&quot;>地理</a>
    </nav>
    <div class=&quot;container&quot;>
        <h1>iPhone 13 Pro 发布：新增120Hz ProMotion 屏幕、更长续航</h1>
        <img src=&quot;https://via.placeholder.com/800x400&quot; alt=&quot;iPhone 13 Pro&quot; class=&quot;news-image&quot;>
        <p>美国时间 2021 年 9 月 14 日凌晨 1 时，苹果在发布会上发布了全新的 iPhone 13 系列，其中包括 iPhone 13、iPhone 13 mini、iPhone 13 Pro 和 iPhone 13 Pro Max。iPhone 13 Pro 新增了 ProMotion 技术屏幕，刷新率最高可达 120Hz，同时续航也有了显著提升。</p>
        <p>iPhone 13 Pro 每秒 120 张的 ProMotion 技术屏幕，以及后置三摄 Pro Camera 系统，带来更出色的拍摄体验。配备 A15 仿生芯片的 iPhone 13 Pro 在性能上有了进一步的提升。</p>
        <p class=&quot;publish-time&quot;>发布时间：2021-09-14</p>
    </div>
</body>
</html>`,
  },
  {
    id: 2,
    name: "Shopping Paradise",
    type: "mobile",
    thumbnail: "https://picsum.photos/200/300?random=3",
    code: `<html lang="en"><head></head><body>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>商品列表页</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f8f8f8;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    input[type="text"] {
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .product {
        display: flex;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 4px;
        background-color: #f9f9f9;
    }
    .image-placeholder {
        width: 100px;
        height: 100px;
        background-color: #e8e8e8;
        margin-right: 20px;
        border-radius: 4px;
    }
    h3 {
        margin: 0;
        color: #333;
    }
    p {
        margin: 5px 0;
        color: #666;
    }
    button {
        padding: 8px 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>


<div class="container">
    <input type="text" placeholder="搜索商品">
    
    <div class="product">
        <div class="image-placeholder"></div>
        <div>
            <h3>商品名称1</h3>
            <p>商品描述1</p>
            <p>价格：$10.00</p>
            <button>立即购买</button>
        </div>
    </div>

    <div class="product">
        <div class="image-placeholder"></div>
        <div>
            <h3>商品名称2</h3>
            <p>商品描述2</p>
            <p>价格：$20.00</p>
            <button>立即购买</button>
        </div>
    </div>

    <div class="product">
        <div class="image-placeholder"></div>
        <div>
            <h3>商品名称3</h3>
            <p>商品描述3</p>
            <p>价格：$30.00</p>
            <button>立即购买</button>
        </div>
    </div>
</div>

</body></html>`,
  },
  {
    id: 3,
    name: "Music Player",
    type: "mobile",
    thumbnail: "https://picsum.photos/200/300?random=11",
    code: `
<html lang=&quot;en&quot;>
<head>
<meta charset=&quot;UTF-8&quot;>
<meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;>
<title>Music Player App - QQ Style</title>
<style>
body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f5f5;
  text-align: center;
}

.container {
  max-width: 400px;
  margin: 50px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

h1 {
  color: #333;
}

.audio-player {
  margin-bottom: 20px;
}

.audio-list {
  list-style: none;
  padding: 0;
}

.audio-list li {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
}

.audio-list li:hover {
  background-color: #e9e9e9;
  color: #333;
}

audio {
  width: 100%;
  margin-top: 20px;
}

</style>
</head>
<body>
<div class=&quot;container&quot;>
  <h1>QQ Music Player</h1>

  <div class=&quot;audio-player&quot;>
    <audio id=&quot;myAudio&quot; controls>
      <source src=&quot;music1.mp3&quot; type=&quot;audio/mpeg&quot;>
      Your browser does not support the audio element.
    </audio>
  </div>

  <ul class=&quot;audio-list&quot; id=&quot;songsList&quot;>
    <li data-src=&quot;music1.mp3&quot;>Song 1</li>
    <li data-src=&quot;music2.mp3&quot;>Song 2</li>
    <li data-src=&quot;music3.mp3&quot;>Song 3</li>
  </ul>
  
</div>

<script>
const audio = document.getElementById('myAudio');
const songsList = document.querySelectorAll('.audio-list li');

songsList.forEach(item => {
  item.addEventListener('click', function() {
    const src = this.getAttribute('data-src');
    audio.src = src;
    audio.play();
  });
});

audio.addEventListener('play', function() {
  console.log('Music is now playing');
});

audio.addEventListener('pause', function() {
  console.log('Music is now paused');
});

audio.addEventListener('ended', function() {
  console.log('Music has ended');
  // Add logic to play the next song automatically
});

</script>
</body>
</html>`,
  },
  {
    id: 4,
    name: "Travel Guide",
    type: "mobile",
    thumbnail: "https://picsum.photos/200/300?random=13",
    code: `<html lang="zh-CN"><head></head><body>


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>北京旅游攻略</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
            font-size: 16px;
        }

        h1 {
            text-align: center;
            color: #333;
            margin: 20px 0;
        }

        h2 {
            background-color: #fff;
            padding: 10px;
            text-align: center;
        }

        .destination {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            max-width: 800px;
        }

        h3 {
            color: #333;
            font-size: 20px;
            margin-top: 15px;
        }

        p {
            color: #666;
            margin: 10px 0;
        }

        .image-placeholder {
            background-color: #f5f5f5;
            height: 400px;
            border-radius: 5px;
        }

        .image-placeholder img {
            max-width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
        }

    </style>


    <h1>北京旅游攻略</h1>
    
    <h2>景点介绍</h2>
    
    <div class="destination">
        <h3>故宫</h3>
        <p>时间：建议花费半天至一整天</p>
        <p>地点：北京市东城区景山前街4号</p>
        <p>故宫，是中国保存较为完整的宫殿建筑群，是中国现存规模最大、建筑面积最大、保存最为完整的木质结构古建筑之一。</p>
        <div class="image-placeholder">
            <img src="https://via.placeholder.com/800x400" alt="故宫">
        </div>
    </div>
    
    <div class="destination">
        <h3>长城</h3>
        <p>时间：建议花费一整天</p>
        <p>地点：北京市昌平区长城</p>
        <p>长城，作为世界文化遗产，是中华民族的古代石质防御工事，是世界八大奇迹之一。</p>
        <div class="image-placeholder">
            <img src="https://via.placeholder.com/800x400" alt="长城">
        </div>
    </div>
    
    <div class="destination">
        <h3>颐和园</h3>
        <p>时间：建议花费半天至一整天</p>
        <p>地点：北京市海淀区颐和园路19号</p>
        <p>颐和园，中国古代皇家园林，也是中国乃至世界上最大的皇家园林。</p>
        <div class="image-placeholder">
            <img src="https://via.placeholder.com/800x400" alt="颐和园">
        </div>
    </div>

</body></html>`,
  }
];

export default templates;
