/* Truyện mới được viết theo từng cặp câu Anh–Việt, đọc đầy đủ khi offline. */
const EXTRA_STORIES = [
  {id:'window-seat',level:'A1',title:'The Window Seat',vi:'Chiếc ghế bên cửa sổ',icon:'train',pairs:[
    ['Every morning, Linh takes the same train.','Mỗi sáng, Linh đi cùng một chuyến tàu.'],
    ['She likes the seat by the window.','Cô thích chiếc ghế bên cửa sổ.'],
    ['Today, a little boy is sitting there.','Hôm nay, một cậu bé đang ngồi ở đó.'],
    ['He is holding a small red notebook.','Cậu đang cầm một cuốn sổ nhỏ màu đỏ.'],
    ['“What are you drawing?” Linh asks.','“Em đang vẽ gì vậy?” Linh hỏi.'],
    ['“A home for the clouds,” he says.','“Một ngôi nhà cho những đám mây,” cậu nói.'],
    ['Linh sits beside him and looks at the sky.','Linh ngồi cạnh cậu và nhìn lên bầu trời.'],
    ['For the first time, she forgets to look at her phone.','Lần đầu tiên, cô quên nhìn điện thoại.']
  ]},
  {id:'small-seed',level:'A1',title:'One Small Seed',vi:'Một hạt giống nhỏ',icon:'plant',pairs:[
    ['Nam finds a seed in his kitchen.','Nam tìm thấy một hạt giống trong bếp.'],
    ['He puts it in a cup of soil.','Cậu đặt nó vào một chiếc cốc đựng đất.'],
    ['He gives it water every day.','Ngày nào cậu cũng tưới nước cho nó.'],
    ['For a week, nothing happens.','Suốt một tuần, chẳng có gì xảy ra.'],
    ['“Perhaps it is sleeping,” his sister says.','“Có lẽ nó đang ngủ,” chị cậu nói.'],
    ['On Monday, a tiny green leaf appears.','Đến thứ Hai, một chiếc lá xanh bé xíu xuất hiện.'],
    ['Nam moves the cup closer to the light.','Nam chuyển chiếc cốc đến gần ánh sáng hơn.'],
    ['Small things need time, too.','Những điều nhỏ bé cũng cần thời gian.']
  ]},
  {id:'blue-umbrella',level:'A1',title:'The Blue Umbrella',vi:'Chiếc ô màu xanh',icon:'rain',pairs:[
    ['It is raining outside the library.','Bên ngoài thư viện, trời đang mưa.'],
    ['An has no umbrella.','An không có ô.'],
    ['A woman stops beside her.','Một người phụ nữ dừng lại bên cạnh cô.'],
    ['“We can share mine,” the woman says.','“Chúng ta có thể che chung ô của tôi,” người phụ nữ nói.'],
    ['They walk slowly to the bus stop.','Họ chậm rãi đi tới trạm xe buýt.'],
    ['An tells her about a funny book.','An kể cho bà nghe về một cuốn sách vui nhộn.'],
    ['The woman laughs, and An laughs too.','Người phụ nữ bật cười, An cũng cười theo.'],
    ['The sky is grey, but the afternoon feels warm.','Bầu trời xám xịt, nhưng buổi chiều lại thật ấm áp.']
  ]},
  {id:'bakery-cat',level:'A1',title:'The Bakery Cat',vi:'Chú mèo ở tiệm bánh',icon:'bread',pairs:[
    ['There is a small bakery near my house.','Gần nhà tôi có một tiệm bánh nhỏ.'],
    ['A white cat sleeps beside the door.','Một chú mèo trắng ngủ bên cửa.'],
    ['Every day, I say hello to it.','Ngày nào tôi cũng chào nó.'],
    ['One morning, the cat is not there.','Một sáng nọ, chú mèo không có ở đó.'],
    ['I ask the baker where it is.','Tôi hỏi người thợ làm bánh xem nó ở đâu.'],
    ['She points to a box behind the counter.','Cô chỉ vào một chiếc hộp phía sau quầy.'],
    ['Three little kittens are sleeping next to the cat.','Ba chú mèo con đang ngủ bên cạnh nó.'],
    ['Now I have four friends to greet.','Giờ tôi có bốn người bạn để chào.']
  ]},
  {id:'last-light',level:'A2',title:'The Last Light',vi:'Ánh đèn cuối cùng',icon:'lamp',pairs:[
    ['When Minh opened his small café, only three customers came.','Khi Minh mở quán cà phê nhỏ của mình, chỉ có ba vị khách ghé đến.'],
    ['By evening, he was ready to close early.','Đến tối, anh đã định đóng cửa sớm.'],
    ['Then he noticed an old man reading outside.','Rồi anh thấy một ông lão đang đọc sách ở bên ngoài.'],
    ['The man was using the light from the café window.','Ông đang đọc nhờ ánh sáng từ cửa sổ quán.'],
    ['Minh brought him a chair and a glass of water.','Minh mang cho ông một chiếc ghế và một cốc nước.'],
    ['“I used to teach in this street,” the man told him.','“Tôi từng dạy học ở con phố này,” ông kể với anh.'],
    ['They talked until the street became quiet.','Họ trò chuyện đến khi con phố trở nên yên tĩnh.'],
    ['Minh still had only three paying customers that day.','Hôm ấy, Minh vẫn chỉ có ba vị khách trả tiền.'],
    ['But he no longer felt that the café was empty.','Nhưng anh không còn cảm thấy quán vắng vẻ nữa.']
  ]},
  {id:'wrong-bus',level:'A2',title:'The Wrong Bus',vi:'Chuyến xe đi nhầm',icon:'train',pairs:[
    ['Hoa was thinking about her interview when she got on the bus.','Hoa đang nghĩ về buổi phỏng vấn khi bước lên xe buýt.'],
    ['Twenty minutes later, she saw fields instead of office buildings.','Hai mươi phút sau, cô thấy những cánh đồng thay vì các tòa nhà văn phòng.'],
    ['She had taken the wrong bus.','Cô đã lên nhầm xe.'],
    ['Her first thought was to give up and go home.','Ý nghĩ đầu tiên của cô là bỏ cuộc và về nhà.'],
    ['Instead, she called the company and explained what had happened.','Thay vào đó, cô gọi cho công ty và giải thích chuyện đã xảy ra.'],
    ['“Thank you for telling us,” the receptionist replied.','“Cảm ơn bạn đã báo cho chúng tôi,” nhân viên lễ tân đáp.'],
    ['They moved her interview to the afternoon.','Họ chuyển buổi phỏng vấn của cô sang buổi chiều.'],
    ['At the next stop, Hoa got off and took a deep breath.','Ở trạm tiếp theo, Hoa xuống xe và hít một hơi thật sâu.'],
    ['A wrong turn did not have to be the end of her journey.','Một lần rẽ nhầm không nhất thiết phải là điểm kết thúc hành trình.']
  ]},
  {id:'quiet-garden',level:'A2',title:'The Quiet Garden',vi:'Khu vườn yên tĩnh',icon:'plant',pairs:[
    ['Behind the apartment building, there was a piece of empty land.','Phía sau tòa chung cư có một khoảng đất trống.'],
    ['People usually left broken chairs and old boxes there.','Mọi người thường để ghế hỏng và hộp cũ ở đó.'],
    ['One Saturday, Lan began to clear a small corner.','Một thứ Bảy, Lan bắt đầu dọn một góc nhỏ.'],
    ['Her neighbour watched from a window, then came down to help.','Người hàng xóm nhìn từ cửa sổ, rồi xuống giúp cô.'],
    ['Together, they planted herbs in the old boxes.','Họ cùng trồng rau thơm trong những chiếc hộp cũ.'],
    ['A week later, someone added a wooden bench.','Một tuần sau, ai đó mang đến một chiếc ghế dài bằng gỗ.'],
    ['Soon, people were meeting there after work.','Chẳng bao lâu, mọi người bắt đầu gặp nhau ở đó sau giờ làm.'],
    ['The garden was small, but it gave the whole building a place to breathe.','Khu vườn nhỏ bé, nhưng đã cho cả tòa nhà một chỗ để thư giãn.']
  ]},
  {id:'saved-message',level:'A2',title:'A Saved Message',vi:'Tin nhắn được giữ lại',icon:'letter',pairs:[
    ['Before her first exam, Vy received a message from her father.','Trước kỳ thi đầu tiên, Vy nhận được một tin nhắn từ bố.'],
    ['It said, “Eat breakfast. Take your time. We love you.”','Tin nhắn viết: “Nhớ ăn sáng. Cứ bình tĩnh làm bài. Bố mẹ yêu con.”'],
    ['She smiled and put her phone away.','Cô mỉm cười rồi cất điện thoại.'],
    ['Years later, she found the message on an old phone.','Nhiều năm sau, cô tìm thấy tin nhắn ấy trên một chiếc điện thoại cũ.'],
    ['She was preparing for her first day at a new job.','Lúc đó, cô đang chuẩn bị cho ngày đầu tiên ở công việc mới.'],
    ['Once again, she was afraid of making mistakes.','Một lần nữa, cô sợ mình sẽ mắc lỗi.'],
    ['She read the three short sentences and made some breakfast.','Cô đọc ba câu ngắn ấy rồi chuẩn bị bữa sáng.'],
    ['Some messages arrive exactly when we need them, even the second time.','Có những tin nhắn đến đúng lúc ta cần, ngay cả khi ta đọc chúng lần thứ hai.']
  ]},
  {id:'repair-shop',level:'B1',title:'Things Worth Repairing',vi:'Những điều đáng sửa lại',icon:'lamp',pairs:[
    ['When the clock stopped, everyone told Huy to buy a new one.','Khi chiếc đồng hồ ngừng chạy, ai cũng bảo Huy mua một chiếc mới.'],
    ['It was cheap, they said, and repairing it would cost more than replacing it.','Họ nói nó rẻ thôi, và sửa nó còn tốn kém hơn thay mới.'],
    ['But the clock had stood on his grandmother’s table for as long as he could remember.','Nhưng chiếc đồng hồ đã nằm trên bàn của bà từ khi anh bắt đầu có ký ức.'],
    ['He took it to a repair shop hidden behind the market.','Anh mang nó đến một tiệm sửa chữa khuất phía sau chợ.'],
    ['The owner listened carefully as Huy described its familiar ticking.','Người chủ chăm chú lắng nghe khi Huy miêu tả tiếng tích tắc quen thuộc.'],
    ['“You are not paying to keep the time,” she said.','“Cậu không trả tiền chỉ để xem giờ,” bà nói.'],
    ['“You are paying to keep a sound.”','“Cậu trả tiền để giữ lại một âm thanh.”'],
    ['A week later, the little clock was working again.','Một tuần sau, chiếc đồng hồ nhỏ lại hoạt động.'],
    ['For the first time since his grandmother had moved away, the kitchen sounded like home.','Lần đầu tiên kể từ khi bà chuyển đi, căn bếp lại vang lên âm thanh của mái ấm.']
  ]},
  {id:'borrowed-courage',level:'B1',title:'Borrowed Courage',vi:'Mượn một chút can đảm',icon:'book',pairs:[
    ['Phuong had practised her presentation so often that she knew every sentence.','Phương đã tập bài thuyết trình nhiều đến mức thuộc từng câu.'],
    ['Yet when she stood in front of the class, she could not remember the first word.','Thế nhưng khi đứng trước lớp, cô lại không nhớ nổi từ đầu tiên.'],
    ['At the back of the room, her friend quietly raised a yellow notebook.','Ở cuối phòng, bạn cô lặng lẽ giơ một cuốn sổ màu vàng lên.'],
    ['On its cover were three words: “Tell me first.”','Trên bìa có ba từ: “Kể mình trước.”'],
    ['Phuong stopped looking at the whole class and looked only at her friend.','Phương thôi nhìn cả lớp mà chỉ nhìn người bạn của mình.'],
    ['She began as if they were talking over lunch.','Cô bắt đầu như thể hai người đang trò chuyện trong bữa trưa.'],
    ['Gradually, she noticed other faces listening with interest.','Dần dần, cô nhận ra những gương mặt khác cũng đang chăm chú lắng nghe.'],
    ['Afterwards, she asked to borrow the notebook.','Sau đó, cô hỏi mượn cuốn sổ.'],
    ['“Keep it,” her friend said. “Someone else might need it next.”','“Cậu giữ đi,” bạn cô nói. “Biết đâu người tiếp theo sẽ cần nó.”']
  ]},
  {id:'open-door',level:'B1',title:'The Open Door',vi:'Cánh cửa mở',icon:'letter',pairs:[
    ['For months, the neighbours had passed one another without speaking.','Suốt nhiều tháng, những người hàng xóm đi ngang qua nhau mà không trò chuyện.'],
    ['They knew the sounds of each other’s lives better than they knew each other’s names.','Họ quen với những âm thanh trong cuộc sống của nhau hơn cả tên của nhau.'],
    ['One evening, a power cut brought everyone into the corridor.','Một tối nọ, sự cố mất điện khiến mọi người cùng bước ra hành lang.'],
    ['Someone brought a candle, and someone else brought a bag of oranges.','Một người mang nến ra, một người khác mang theo túi cam.'],
    ['A child asked why the adults always looked so busy.','Một đứa trẻ hỏi tại sao người lớn lúc nào cũng có vẻ bận rộn.'],
    ['Nobody had a good answer, so they laughed and shared the fruit.','Không ai có câu trả lời thỏa đáng, nên họ bật cười rồi chia nhau trái cây.'],
    ['When the lights returned, nobody stood up immediately.','Khi điện có lại, chẳng ai đứng dậy ngay.'],
    ['The following evening, one door remained open.','Tối hôm sau, một cánh cửa vẫn mở.'],
    ['Beside it stood a bowl of oranges and a handwritten invitation.','Bên cạnh là một bát cam cùng một lời mời viết tay.']
  ]},
  {id:'future-letter',level:'B1',title:'A Letter to Tomorrow',vi:'Lá thư gửi ngày mai',icon:'letter',pairs:[
    ['At sixteen, Bao wrote a letter to the person he hoped to become.','Năm mười sáu tuổi, Bảo viết thư cho con người mà mình mong sẽ trở thành.'],
    ['He imagined a large house, an exciting job, and a life without uncertainty.','Cậu hình dung một ngôi nhà lớn, một công việc thú vị và cuộc sống không có điều gì bất định.'],
    ['Ten years later, he opened the letter in a rented room above a noisy street.','Mười năm sau, anh mở lá thư trong căn phòng thuê phía trên một con phố ồn ào.'],
    ['At first, he felt that he had disappointed his younger self.','Thoạt đầu, anh cảm thấy mình đã khiến bản thân thời trẻ thất vọng.'],
    ['Then he reached the final question: “Do you still make things?”','Rồi anh đọc đến câu hỏi cuối: “Anh vẫn còn tự tay làm ra những thứ mới chứ?”'],
    ['He looked at the wooden toys drying on his desk.','Anh nhìn những món đồ chơi bằng gỗ đang hong khô trên bàn.'],
    ['Although his life had taken a different direction,','Dù cuộc đời đã đi theo một hướng khác,'],
    ['the part of him that loved creating something from nothing was still there.','phần con người yêu thích việc tạo ra điều gì đó từ hai bàn tay trắng vẫn còn nguyên.'],
    ['He turned the paper over and began a reply.','Anh lật mặt sau tờ giấy và bắt đầu viết hồi âm.'],
    ['“Yes,” he wrote. “And I think you would like them.”','“Có,” anh viết. “Và anh nghĩ em sẽ thích chúng.”']
  ]}
];

/* Tình huống thực chiến: hội thoại Mỹ tự nhiên, khám phá thế giới và xử lý việc thật. */
EXTRA_STORIES.push(
  {id:'missed-connection',level:'B1',title:'A Missed Connection in Chicago',vi:'Lỡ chuyến nối chuyến ở Chicago',icon:'train',pairs:[
    ['Maya looks at the departure board and realizes her flight is already boarding.','Maya nhìn bảng khởi hành và nhận ra chuyến bay của mình đã bắt đầu lên máy bay.'],
    ['“Excuse me, is there any chance I can still make this flight?” she asks.','“Xin lỗi, liệu tôi còn kịp chuyến bay này không?” cô hỏi.'],
    ['The gate agent shakes his head and says, “I’m sorry, but the door just closed.”','Nhân viên cửa ra máy bay lắc đầu và nói: “Tôi rất tiếc, nhưng cửa vừa đóng rồi.”'],
    ['“Okay, what are my options?” Maya asks instead of arguing.','“Được rồi, tôi còn những lựa chọn nào?” Maya hỏi thay vì tranh cãi.'],
    ['“I can put you on the 6:40 flight, but you’ll have a four-hour wait.”','“Tôi có thể chuyển cô sang chuyến 6 giờ 40, nhưng cô sẽ phải đợi bốn tiếng.”'],
    ['“That works for me. Will my checked bag move to the new flight too?”','“Như vậy được với tôi. Hành lý ký gửi của tôi cũng được chuyển sang chuyến mới chứ?”'],
    ['He prints a new boarding pass and points her toward customer service.','Anh in thẻ lên máy bay mới và chỉ cô đến quầy dịch vụ khách hàng.'],
    ['Maya uses the extra time to walk along the lake and try a local sandwich.','Maya dùng thời gian còn lại để đi dạo ven hồ và thử một chiếc bánh mì kẹp địa phương.'],
    ['Missing a connection changes her afternoon, but it does not ruin her trip.','Lỡ chuyến nối chuyến làm thay đổi buổi chiều của cô, nhưng không phá hỏng chuyến đi.']
  ]},
  {id:'subway-new-york',level:'A2',title:'Finding the Right Subway',vi:'Tìm đúng tàu điện ngầm',icon:'train',pairs:[
    ['Eli is standing in a New York subway station with a map in his hand.','Eli đang đứng trong một ga tàu điện ngầm ở New York với tấm bản đồ trên tay.'],
    ['“Hey, does this train go downtown?” he asks a woman on the platform.','“Chào chị, tàu này có đi xuống khu trung tâm không?” anh hỏi một phụ nữ trên sân ga.'],
    ['“Not this one. You want the train across the platform,” she says.','“Không phải tàu này. Anh cần chuyến ở sân ga đối diện,” cô nói.'],
    ['“Got it. Do I need to swipe my card again?”','“Tôi hiểu rồi. Tôi có cần quẹt thẻ lại không?”'],
    ['“Nope, just take the stairs and follow the downtown signs.”','“Không đâu, cứ đi cầu thang rồi theo biển chỉ hướng downtown.”'],
    ['Eli thanks her and reaches the other side before the doors close.','Eli cảm ơn cô và sang được phía bên kia trước khi cửa đóng.'],
    ['Two stops later, he checks the street signs to make sure he is going the right way.','Hai trạm sau, anh kiểm tra biển tên đường để chắc chắn mình đang đi đúng hướng.'],
    ['In a new city, one clear question can save twenty minutes of guessing.','Ở một thành phố mới, một câu hỏi rõ ràng có thể giúp ta khỏi mất hai mươi phút đoán đường.']
  ]},
  {id:'night-market',level:'A2',title:'Dinner at a Night Market',vi:'Bữa tối ở chợ đêm',icon:'bread',pairs:[
    ['Nora follows the smell of grilled food through a busy night market in Taipei.','Nora đi theo mùi đồ nướng xuyên qua một khu chợ đêm đông đúc ở Đài Bắc.'],
    ['“What’s that?” she asks, pointing to a crispy pancake.','“Món đó là gì vậy?” cô hỏi và chỉ vào một chiếc bánh giòn.'],
    ['The vendor smiles and says, “Scallion pancake. Want to try one?”','Người bán mỉm cười và nói: “Bánh hành. Cô muốn thử một cái không?”'],
    ['“Sure. Is it spicy?”','“Được chứ. Món đó có cay không?”'],
    ['“Only if you add this sauce,” he replies.','“Chỉ cay nếu cô thêm loại sốt này,” ông trả lời.'],
    ['Nora asks for the sauce on the side and pays with a small bill.','Nora xin để sốt riêng rồi trả bằng một tờ tiền mệnh giá nhỏ.'],
    ['The first bite is hot, salty, and much better than the snack at her hotel.','Miếng đầu tiên nóng hổi, đậm vị và ngon hơn hẳn món ăn nhẹ ở khách sạn.'],
    ['She saves the stall on her map so she can find it again tomorrow.','Cô lưu vị trí quầy hàng trên bản đồ để ngày mai có thể tìm lại.']
  ]},
  {id:'lost-hike',level:'B1',title:'Off the Trail in Colorado',vi:'Lạc khỏi đường mòn ở Colorado',icon:'plant',pairs:[
    ['Ben and Luis stop when the trail suddenly disappears under fresh snow.','Ben và Luis dừng lại khi đường mòn đột nhiên biến mất dưới lớp tuyết mới.'],
    ['“I don’t remember passing that rock,” Luis says.','“Tôi không nhớ mình đã đi qua tảng đá đó,” Luis nói.'],
    ['“Me neither. Let’s not keep walking until we know where we are,” Ben replies.','“Tôi cũng vậy. Đừng đi tiếp cho đến khi biết mình đang ở đâu,” Ben trả lời.'],
    ['They open the offline map and compare it with the direction of the ridge.','Họ mở bản đồ ngoại tuyến và so sánh nó với hướng của dãy núi.'],
    ['Their phone signal is weak, but the location marker still works.','Sóng điện thoại rất yếu, nhưng dấu vị trí vẫn hoạt động.'],
    ['“We’re only half a mile off the main trail,” Ben says.','“Chúng ta chỉ lệch khỏi đường mòn chính khoảng nửa dặm,” Ben nói.'],
    ['They turn back, follow their own footprints, and reach the marked path.','Họ quay lại, đi theo dấu chân của chính mình và trở về đường có đánh dấu.'],
    ['At the ranger station, Luis says, “That was closer than I’d like.”','Tại trạm kiểm lâm, Luis nói: “Tình huống đó nguy hiểm hơn mức tôi mong muốn.”'],
    ['The ranger nods and says, “Turning around early was the right call.”','Kiểm lâm gật đầu và nói: “Quay lại sớm là quyết định đúng.”']
  ]},
  {id:'hotel-problem',level:'B1',title:'The Room Is Not What We Booked',vi:'Phòng không giống như đã đặt',icon:'house',pairs:[
    ['Jade opens the hotel room and finds one bed instead of two.','Jade mở cửa phòng khách sạn và thấy một giường thay vì hai giường.'],
    ['At the front desk, she says, “Hi, I think there’s been a mix-up with our room.”','Tại quầy lễ tân, cô nói: “Chào bạn, tôi nghĩ phòng của chúng tôi đã bị sắp xếp nhầm.”'],
    ['“We booked two queen beds, but the room has one king bed.”','“Chúng tôi đặt hai giường cỡ queen, nhưng phòng lại có một giường cỡ king.”'],
    ['The clerk checks the reservation and says, “You’re right. That’s on us.”','Nhân viên kiểm tra đơn đặt phòng và nói: “Cô nói đúng. Đây là lỗi của chúng tôi.”'],
    ['“We’re sold out tonight, but I can offer a rollaway bed and free breakfast.”','“Tối nay chúng tôi đã hết phòng, nhưng tôi có thể cung cấp giường phụ và bữa sáng miễn phí.”'],
    ['Jade asks, “Could you also move us to the correct room tomorrow?”','Jade hỏi: “Bạn cũng có thể chuyển chúng tôi sang đúng loại phòng vào ngày mai không?”'],
    ['“Absolutely. I’ll make a note so you won’t have to explain it again.”','“Chắc chắn rồi. Tôi sẽ ghi chú để cô không phải giải thích lại.”'],
    ['Jade takes a photo of the updated reservation before returning upstairs.','Jade chụp lại thông tin đặt phòng đã cập nhật trước khi quay lên lầu.']
  ]},
  {id:'pharmacy-help',level:'A2',title:'Asking for Help at a Pharmacy',vi:'Hỏi mua thuốc tại hiệu thuốc',icon:'lamp',pairs:[
    ['Sam walks into a pharmacy because his throat has been sore all day.','Sam bước vào hiệu thuốc vì cổ họng của anh đã đau cả ngày.'],
    ['“Hi, do you have anything for a sore throat?” he asks.','“Chào bạn, ở đây có thuốc gì dành cho đau họng không?” anh hỏi.'],
    ['The pharmacist asks, “Do you have a fever or trouble breathing?”','Dược sĩ hỏi: “Anh có bị sốt hoặc khó thở không?”'],
    ['“No, it just hurts when I swallow.”','“Không, tôi chỉ đau khi nuốt.”'],
    ['She shows him two options and explains how often to take them.','Cô đưa cho anh hai lựa chọn và giải thích tần suất sử dụng.'],
    ['“Will this make me sleepy?” Sam asks.','“Thuốc này có làm tôi buồn ngủ không?” Sam hỏi.'],
    ['“This one might, so don’t drive after you take it,” she says.','“Loại này có thể gây buồn ngủ, vì vậy đừng lái xe sau khi uống,” cô nói.'],
    ['Sam reads the label once more before paying.','Sam đọc nhãn thuốc thêm một lần nữa trước khi thanh toán.']
  ]},
  {id:'rental-car',level:'B1',title:'A Flat Tire on the Coast',vi:'Xẹp lốp trên đường ven biển',icon:'train',pairs:[
    ['A warning light appears while Kim is driving a rental car along the coast.','Một đèn cảnh báo xuất hiện khi Kim đang lái xe thuê dọc bờ biển.'],
    ['She pulls into a safe area and calls roadside assistance.','Cô tấp vào khu vực an toàn rồi gọi dịch vụ hỗ trợ trên đường.'],
    ['“I think I have a flat tire, and I’m about ten miles north of Monterey,” she says.','“Tôi nghĩ xe bị xẹp lốp và tôi đang ở cách Monterey khoảng mười dặm về phía bắc,” cô nói.'],
    ['The agent asks for the license plate and the nearest mile marker.','Nhân viên hỏi biển số xe và cột mốc dặm gần nhất.'],
    ['“Stay in the car if traffic is heavy, and turn on your hazard lights,” he tells her.','“Hãy ở trong xe nếu giao thông đông và bật đèn cảnh báo nguy hiểm,” anh dặn cô.'],
    ['A service truck arrives thirty minutes later and replaces the tire.','Một xe dịch vụ đến sau ba mươi phút và thay lốp xe.'],
    ['Kim asks for a receipt and takes pictures for the rental company.','Kim xin biên lai và chụp ảnh để gửi cho công ty cho thuê xe.'],
    ['She reaches the next town before sunset and checks the other tires too.','Cô đến thị trấn tiếp theo trước khi mặt trời lặn và kiểm tra cả những lốp còn lại.']
  ]},
  {id:'local-festival',level:'B1',title:'An Invitation in Oaxaca',vi:'Lời mời ở Oaxaca',icon:'letter',pairs:[
    ['Leah hears music while walking through a neighborhood in Oaxaca.','Leah nghe thấy tiếng nhạc khi đang đi bộ qua một khu phố ở Oaxaca.'],
    ['A family is decorating the street, so she asks, “What’s going on?”','Một gia đình đang trang trí đường phố, vì vậy cô hỏi: “Ở đây đang có chuyện gì vậy?”'],
    ['“We’re getting ready for a community festival,” a man explains.','“Chúng tôi đang chuẩn bị cho lễ hội của cộng đồng,” một người đàn ông giải thích.'],
    ['“That looks amazing. Is it okay if visitors watch?” Leah asks.','“Trông tuyệt quá. Khách du lịch có thể đứng xem không?” Leah hỏi.'],
    ['“Of course. Actually, we could use an extra pair of hands.”','“Tất nhiên. Thật ra chúng tôi đang cần thêm người giúp.”'],
    ['Leah spends the afternoon hanging paper decorations above the street.','Leah dành cả buổi chiều để treo đồ trang trí bằng giấy phía trên đường.'],
    ['She learns the names of three local dishes and practices a few Spanish phrases.','Cô học tên ba món ăn địa phương và luyện vài câu tiếng Tây Ban Nha.'],
    ['By evening, she is no longer watching the festival from the outside.','Đến tối, cô không còn đứng ngoài quan sát lễ hội nữa.'],
    ['She is carrying food to a table while her new friends save her a seat.','Cô đang mang đồ ăn đến bàn trong khi những người bạn mới giữ chỗ cho cô.']
  ]}
);
