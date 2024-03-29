var alphaDust = function () {

    var _menuOn = false;

    /**
     * 首页文章标题动效
     */
    function initPostHeader() {
        $('.main .post').each(function () {
            var $post = $(this);
            var $header = $post.find('.post-header.index');
            var $title = $post.find('h1.title');
            var $readMoreLink = $post.find('a.read-more');

            var toggleHoverClass = function () {
                $header.toggleClass('hover');
            };

            $title.hover(toggleHoverClass, toggleHoverClass);
            $readMoreLink.hover(toggleHoverClass, toggleHoverClass);
        });
    }

    function _menuShow () {
        $('nav a').addClass('menu-active');
        $('.menu-bg').show();
        $('.menu-item').css({opacity: 0});
        TweenLite.to('.menu-container', 1, {padding: '0 40px'});
        TweenLite.to('.menu-bg', 1, {opacity: '0.92'});
        TweenMax.staggerTo('.menu-item', 0.5, {opacity: 1}, 0.3);
        _menuOn = true;

        $('.menu-bg').hover(function () {
            $('nav a').toggleClass('menu-close-hover');
        });
    }

    function _menuHide() {
        $('nav a').removeClass('menu-active');
        TweenLite.to('.menu-bg', 0.5, {opacity: '0', onComplete: function () {
            $('.menu-bg').hide();
        }});
        TweenLite.to('.menu-container', 0.5, {padding: '0 100px'});
        $('.menu-item').css({opacity: 0});
        _menuOn = false;
    }

    /**
     * 菜单切换
     */
    function initMenu() {
        $('.menu-bar a').click(function () {
            if(_menuOn) {
                _menuHide();
            } else {
                _menuShow();
            }
        });

        $('.menu-bg').click(function (e) {
            if(_menuOn && e.target === this) {
                _menuHide();
            }
        });
    }

    /**
     * 归档列表动效
     */
    function displayArchives() {
        $('.archive-post').css({opacity: 0});
        TweenMax.staggerTo('.archive-post', 0.4, {opacity: 1}, 0.15);
    }


    // A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
    // Copyright (C) 2017 
    // Liam Huang <http://github.com/Liam0205>
    // This library is free software; you can redistribute it and/or modify
    // it under the terms of the GNU Lesser General Public License as
    // published by the Free Software Foundation; either version 2.1 of the
    // License, or (at your option) any later version.
    // 
    // This library is distributed in the hope that it will be useful, but
    // WITHOUT ANY WARRANTY; without even the implied warranty of
    // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    // Lesser General Public License for more details.
    // 
    // You should have received a copy of the GNU Lesser General Public
    // License along with this library; if not, write to the Free Software
    // Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
    // 02110-1301 USA
    // 

    var getPostList = function () {
      return new Promise((resolve, reject) => {
        const path = "/search.xml";
        // load xml file
        $.ajax({
          url: path,
          dataType: "xml",
          success: function (xmlResponse) {
            // parse xml file
            var datas = $("entry", xmlResponse).map(function () {
              return {
                title: $("title", this).text(),
                content: $("content", this).text(),
                url: $("url", this).text()
              };
            }).get();
            resolve(datas)
          }
        });
      })
    }

    let handleSearch = function (datas, tpl) {
      var $resultContent = document.getElementById('local-search-result');
      $resultContent.style.display = 'block';
      // 0x03. parse query to keywords list
      var str = '<ul class=\"search-result-list\">';
      var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
      $resultContent.innerHTML = "";
      if (this.value.trim().length <= 0) {
        return;
      }
      // 0x04. perform local searching
      datas.forEach(function (data) {
        var isMatch = true;
        var content_index = [];
        if (!data.title || data.title.trim() === '') {
          data.title = "Untitled";
        }
        var orig_data_title = data.title.trim();
        var data_title = orig_data_title.toLowerCase();
        var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
        var data_content = orig_data_content.toLowerCase();
        var data_url = data.url;
        var index_title = -1;
        var index_content = -1;
        var first_occur = -1;
        // only match artiles with not empty contents
        if (data_content !== '') {
          keywords.forEach(function (keyword, i) {
            index_title = data_title.indexOf(keyword);
            index_content = data_content.indexOf(keyword);

            if (index_title < 0 && index_content < 0) {
              isMatch = false;
            } else {
              if (index_content < 0) {
                index_content = 0;
              }
              if (i == 0) {
                first_occur = index_content;
              }
              // content_index.push({index_content:index_content, keyword_len:keyword_len});
            }
          });
        } else {
          isMatch = false;
        }
        // 0x05. show search results
        if (isMatch) {
          str += "<li><a href='" + data_url + "' class='search-result-title' target='_blank'>" + orig_data_title + "</a>";
          var content = orig_data_content;
          if (first_occur >= 0) {
            // cut out 100 characters
            var start = first_occur - 20;
            var end = first_occur + 80;

            if (start < 0) {
              start = 0;
            }

            if (start == 0) {
              end = 100;
            }

            if (end > content.length) {
              end = content.length;
            }

            var match_content = content.substr(start, end);

            // highlight all keywords
            keywords.forEach(function (keyword) {
              var regS = new RegExp(keyword, "gi");
              match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
            });

            str += "<p class=\"search-result\">" + match_content + "...</p>"
          }
          str += "</li>";
        }
      });
      str += "</ul>";
      if (str.indexOf('<li>') === -1) {
        return $resultContent.innerHTML = tpl + "<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词。<span></ul>";
      }
      $resultContent.innerHTML = tpl + str;
    }

    /**
     * 搜索
     * @return {[type]} [description]
     */
    const initSearch = async function(){
      var inputEl = document.getElementById('local-search-input');
      var resultEl = document.getElementById('local-search-result');

      // 0x00. environment initialization
      var tpl = "<i id='local-search-close'>×</i>";
      resultEl.innerHTML = tpl + "<ul><span class='local-search-empty'>首次搜索，正在载入索引文件，请稍后……<span></ul>";
      resultEl.style.display = 'none';
      
      const res = await getPostList();
      resultEl.innerHTML = "";

      handleSearch = handleSearch.bind(inputEl, res, tpl)
      inputEl.addEventListener('input', handleSearch);

      $(document).on('click', '#local-search-close', function() {
        $('#local-search-input').val('');
        $('#local-search-result').html('');
      });
    }

    return {
        initPostHeader: initPostHeader,
        initMenu: initMenu,
        displayArchives: displayArchives,
        initSearch: initSearch
    };
}();

$(document).ready(function () {
    alphaDust.initPostHeader();
    alphaDust.initMenu();
    alphaDust.displayArchives();
    alphaDust.initSearch();
});
