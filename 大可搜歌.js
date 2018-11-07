$app.open();
$ui.loading(true);
var url = "http://moresound.tk/music/api.php?search=";
var Cookie =
  "encrypt_data=d0b6676a3396be680f5f37230c50b3cff0223643a72d1f41ef13ec99df6bcc0910b903c5f8c9e88d26ef96c4280cfc31ec329ca50cf1cfa07a526c0841b763a3d10bab8695d107fb86ef240f0d3281e3a998d3bf9a30d20630517926a7530d90c1d174d8910dd9edf282c973036fb44d52af6d15697d78b3a3950b8f8d2f6140; Tip_of_the_day=2";
var nowtype = "";
var coverdata;
var types = [
  {
    name: "QQ",
    type: "qq"
  },
  {
    name: "网易",
    type: "wy"
  },
  {
    name: "百度",
    type: "bd"
  },
  {
    name: "酷狗",
    type: "kg"
  },
  {
    name: "酷我",
    type: "kw"
  },
  {
    name: "虾米",
    type: "xm"
  }
];
$ui.render({
  props: {
    title: "大可搜歌"
  },
  views: [
    {
      type: "input",
      props: {
        id: "input",
        type: $kbType.search,
        darkKeyboard: true
      },
      layout: function(make, view) {
        make.top.equalTo(5);
        make.left.equalTo(10);
        make.size.equalTo($size($device.info.screen.width - 20, 35));
      }
    },
    {
      type: "matrix",
      props: {
        columns: 6,
        itemHeight: 32,
        spacing: 5,
        template: [
          {
            type: "label",
            props: {
              id: "type",
              font: $font(16),
              align: $align.center,
              textColor: $color("#ffffff"),
              bgcolor: $color("#1E90FF")
            },
            layout: $layout.fill
          }
        ],
        data: types.map(function(item) {
          return {
            type: {
              text: "" + item.name
            }
          };
        })
      },
      layout: function(make, view) {
        make.top.equalTo(40);
        make.size.equalTo($device.info.screen.width - 20, 40);
        make.left.equalTo(10);
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          //         alert(data.type.text)
          searchSong(data);
        }
      }
    },
    {
      type: "list",
      props: {
        id: "songlist",
        template: {
          props: {
            rowHeight: 50
          },
          views: [
            {
              type: "label",
              props: {
                id: "songname",
                font: $font(16)
              },
              layout: function(make, view) {
                make.left.equalTo(10);
                make.top.equalTo(5);
              }
            },
            {
              type: "label",
              props: {
                id: "singer",
                font: $font(13),
                textColor: $color("#8d8d8d")
              },
              layout: function(make, view) {
                make.left.equalTo(10);
                make.top.equalTo(25);
              }
            },
            {
              type: "label",
              props: {
                id: "albumname",
                font: $font(13),
                textColor: $color("#8d8d8d")
              },
              layout: function(make, view) {
                make.right.equalTo(-10);
                make.top.equalTo(25);
              }
            }
          ]
        }
      },
      layout: function(make, view) {
        make.top.equalTo(90);
        make.left.equalTo(10);
        make.size.equalTo(
          $size(
            $device.info.screen.width - 20,
            $device.info.screen.height - 120
          )
        );
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          //          alert(data)
          openSecondPage(data.songname.text, data.songid);
        }
      }
    },
    {
      type: "spinner",
      props: {
        id: "spinner",
        loading: false,
        style: 2,
        bgcolor:$rgba(207,207,207,0.5)
      },
      layout: $layout.fill
    }
  ]
});
//歌曲请求函数
function searchSong(data) {
  $("input").blur()
  types.map(function(item) {
    if (item.name == data.type.text) {
      nowtype = item.type;
      var name = $("input").text;
      //      alert(name)
      if (name != "") {
        $("spinner").loading = true;
        $http.request({
          method: "POST",
          url: url + item.type,
          header: {
            Host: "moresound.tk",
            Origin: "http://moresound.tk",
            Cookie: Cookie
          },
          form: {
            w: name,
            p: "1",
            n: "100"
          },
          handler: function(resp) {
            $("spinner").loading = false;
            //        alert(resp.data.song_list)
            $("songlist").data = resp.data.song_list.map(function(song) {
              var songname1 = "";
              var albumname = "";
              if (song.songname.indexOf("<sup") == -1) {
                songname1 = song.songname;
              } else {
                songname1 = song.songname.substring(
                  0,
                  song.songname.indexOf("<sup")
                );
              }
              if (song.albumname == "") {
                albumname = "无";
              } else {
                albumname = song.albumname;
              }
              return {
                songname: {
                  text: songname1
                },
                albumname: {
                  text: "《" + albumname + "》"
                },
                singer: {
                  text: song.singer[0].name
                },
                songid: song.songmid
              };
            });
          }
        });
      } else {
        alert("请输入歌名");
      }
    }
  });
}

function getSongInfo(id) {
  //  alert(nowtype+id)
  $("spinner2").loading = true;
  $http.request({
    method: "POST",
    url: "http://moresound.tk/music/api.php?get_song=" + nowtype,
    header: {
      Host: "moresound.tk",
      Origin: "http://moresound.tk",
      Cookie: Cookie
    },
    form: {
      mid: id + ""
    },
    handler: function(resp) {
//      alert(resp.data)
      $("spinner2").loading = false;
      //      alert(resp.data.url.专辑封面)
      $("cover").src = resp.data.url.专辑封面;
      $http.download({
        url: resp.data.url.专辑封面,
        progress: function(bytesWritten, totalBytes) {
          var percentage = (bytesWritten * 1.0) / totalBytes;
        },
        handler: function(resp) {
          coverdata = resp.data;
        }
      });
      var datas = [];
      for (var k in resp.data.url) {
        var it = {
          item2: {
            text: k
          },
          link: resp.data.url[k]
        };
        if(k.indexOf("AAC")!=-1||k.indexOf("FLAC")!=-1||k.indexOf("MP3")!=-1||k.indexOf("MV")!=-1||k.indexOf("lrc")!=-1||k.indexOf("APE")!=-1){
          datas.push(it);
        }
        
      }
      $("songdellist").data = datas;
    }
  });
}

function openSecondPage(title, id) {
  //  alert(title)
  $ui.push({
    props: {
      title: title
    },
    views: [
      {
        type: "image",
        props: {
          id: "cover"
        },
        layout: function(make, view) {
          make.top.equalTo(25);
          make.left.equalTo(($device.info.screen.width - 250) / 2);
          make.size.equalTo($size(250, 250));
        },
        events: {
          longPressed: function(info) {
            $photo.save({
              data: coverdata,
              handler: function(success) {
                $ui.toast("保存成功！");
              }
            });
          }
        }
      },
      {
        type: "label",
        props: {
          text: "(长按保存封面)",
          font: $font(14),
          textColor: $color("#8d8d8d")
        },
        layout: function(make, view) {
          make.top.equalTo(280);
          make.left.equalTo($device.info.screen.width / 2 - 50);
        }
      },
      {
        type: "list",
        props: {
          id: "songdellist",
          align: $align.center,
          template: {
            props: {},
            views: [
              {
                type: "label",
                props: {
                  id: "item2"
                },
                layout: $layout.center
              }
            ]
          }
        },
        layout: function(make, view) {
          make.top.equalTo(300);
          make.left.equalTo(($device.info.screen.width - 300) / 2);
          make.size.equalTo(300, $device.info.screen.height - 400);
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            if(data.item2.text=="lrc"){
              
              $clipboard.text = data.link
               $ui.toast("已将URL复制到剪切板,请用下载工具下载");
            }else{
              getDownloadUrl(data.link);
            }
            
          }
        }
      },
      {
        type: "spinner",
        props: {
          id: "spinner2",
          loading: false,
          style: 2,
          bgcolor:$rgba(207,207,207,0.5)
        },
        layout: $layout.fill
      }
    ]
  });
  getSongInfo(id);
}

function getDownloadUrl(api) {
  $("spinner2").loading = true
  $http.request({
    method: "POST",
    url: "http://moresound.tk/music/" + api,
    header: {
      Host: "moresound.tk",
      Origin: "http://moresound.tk",
      Cookie: Cookie
    },
    form: {},
    handler: function(resp) {
      $("spinner2").loading = false
//      alert(resp.data);
      $clipboard.text = resp.data.url;
      $ui.toast("已将URL复制到剪切板,请用下载工具下载");
    }
  });
}
