-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-366daf26-shopee-ltw.e.aivencloud.com    Database: shopee-ltw
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '099082f0-25fe-11f0-9651-862ccfb03eb3:1-854,
0d83298b-02d3-11f0-88ba-5646a99e8ced:1-36,
53965f38-09e8-11f0-bc3e-b2e4aa938b2b:1-2466';

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (2,12,12,'xin chào bạn','2025-05-04 06:29:18',NULL),(4,12,7,'xin chào bạn ở nha','2025-05-04 06:57:36',NULL),(7,12,7,'xin chào','2025-05-04 07:07:05',NULL),(9,15,7,'tôi thấy bài viết này rất hay và bổ ích','2025-05-04 11:50:51',NULL),(45,15,7,'xin chào bạn xin chào','2025-05-04 14:40:16',NULL),(46,15,12,'xin chào quý khách! xin chào','2025-05-04 14:45:12',45),(47,15,12,'cảm ơn!','2025-05-04 14:45:19',9),(51,15,7,'Xứng đáng lắm! Cả mùa giải chơi quá hay, tinh thần chiến đấu tuyệt vời từ Arne Slot và các học trò!”','2025-05-04 15:20:28',NULL),(52,15,7,'Liverpool chứng minh họ là đội bóng lớn thật sự – vừa có bản lĩnh, vừa có lối chơi đẹp mắt.','2025-05-04 15:20:40',NULL),(53,15,7,'Tuyệt vời! Đội hình trẻ hóa mà vẫn vô địch, quá giỏi Slot ơi!','2025-05-04 15:20:50',NULL),(56,15,12,'cảm ơn bạn nhé','2025-05-08 10:20:08',53),(60,18,14,'rất hay','2025-05-09 01:26:17',NULL),(66,11,7,'Shopee tuyệt zời quá đi','2025-05-08 14:58:00',NULL),(68,11,3,'cảm ơn shopee đã tạo điều kiện','2025-05-08 17:06:25',NULL),(71,21,12,'vâng!','2025-05-08 18:06:03',76),(72,8,1,'Hàng dỏm, lừa đảo','2025-05-09 00:28:02',NULL),(73,8,1,'Hàng dỏm, lừa đảo','2025-05-09 00:28:09',NULL),(74,18,12,'cảm ơn bạn đã quan tâm đến chương trình này','2025-05-09 01:25:53',60),(75,17,12,'xin cảm ơn quý khách','2025-05-09 01:26:17',65),(76,21,14,'RẤT HAY','2025-05-08 18:06:03',NULL),(78,11,1,'cảm ơn shopee <3','2025-05-09 02:29:51',NULL),(79,11,1,'cảm ơn shopee <3','2025-05-09 02:29:56',NULL),(80,21,1,'bài viết hay','2025-05-09 02:39:01',NULL),(82,21,4,'cảm ơn','2025-05-09 02:41:12',80);
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `click_number` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `Posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (4,'Siêu sale 4/4 Shopee Giảm Giá 70% – Nhưng Có Thật Là Rẻ Không?','<p>Đây là nội dung của bài viết đầu tiên. Nội dung này mô tả chi tiết về sản phẩm và thông tin hữu ích cho khách hàng.</p>\n','http://localhost:8000/uploads/avatars/681caba593a0c_son-tungfinal-2-1508470291678-min.webp',12,'2025-04-04 17:44:00',2),(5,'Ai là người sáng lập Shopee?','<p>Nội dung bài viết thứ hai rất thú vị, cung cấp thêm các thông tin mới về sản phẩm.</p>\n','http://localhost:8000/uploads/avatars/681cabd9e2e3d_ytuongbandaucafeland-1478272607.jpg',12,'2025-04-04 17:44:00',2),(8,'Top 5 bàn phím cháy hàng Shopee tháng 4','<p>Nội dung bài viết thứ hai rất thú vị, cung cấp thêm các thông tin mới về sản phẩm. 1212</p>\n','http://localhost:8000/uploads/avatars/681cab4abaf95_4951_.jfif',12,'2025-04-04 17:44:16',7),(9,'Top 7 Món Đặc Sản Địa Phương Đang Gây Sốt Trên Shopee','<p>Bài viết thứ ba được cập nhật với nhiều thông tin chi tiết và hình ảnh minh họa.</p>\n','http://localhost:8000/uploads/avatars/681cab7ba9618_cach-nau-bun-nuoc-leo-soc-trang-ngon-dam-da-chuan-vi-an-mot-lan-la-nho-mai-202208301437543598.jpg',12,'2025-04-04 17:44:16',5),(10,'Shopee ký kết hợp tác chiến lược với Hợp tác xã Nông nghiệp Trà Vinh – Đưa nông sản lên sàn','<p>Nhằm thúc đẩy tiêu thụ nông sản địa phương và hỗ trợ người nông dân chuyển đổi số, sáng ngày 8/5, Shopee Việt Nam đã chính thức ký kết hợp tác chiến lược với Hợp tác xã Nông nghiệp Trà Vinh. Đây là bước đi quan trọng trong hành trình đưa các sản phẩm nông nghiệp chất lượng cao của Trà Vinh đến gần hơn với người tiêu dùng trên toàn quốc.</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca9cfa7c41_06.jpg\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p><strong>Tại lễ ký kết</strong>, đại diện Shopee cam kết sẽ đồng hành cùng Hợp tác xã trong việc:</p>\n<p>Đào tạo kỹ năng bán hàng online cho thành viên hợp tác xã.</p>\n<p>Hỗ trợ tạo gian hàng chính hãng trên Shopee.</p>\n<p>Tối ưu quy trình đóng gói, vận chuyển và chăm sóc khách hàng.</p>\n<p>Đưa sản phẩm tham gia các chương trình khuyến mãi lớn của Shopee như Siêu Sale, Shopee Live, Shopee Mall…</p>\n<p><em>“Chúng tôi tin rằng việc kết nối nông sản Trà Vinh với thương mại điện tử không chỉ giúp người dân tăng thu nhập mà còn góp phần quảng bá thương hiệu địa phương ra toàn quốc”</em> – ông Nguyễn Văn Minh, đại diện Shopee chia sẻ.</p>\n<p>Các sản phẩm tiêu biểu được đưa lên sàn Shopee trong đợt đầu bao gồm:</p>\n<p><strong>Gạo sạch Trà Vinh</strong></p>\n<p><strong>Dừa sáp Trà Vinh</strong></p>\n<p><strong>Mắm tôm chua Cầu Kè</strong></p>\n<p><strong>Trái cây sấy lạnh xuất khẩu</strong></p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca9e381658_z5119484396439_Ho-Dao-Tra-Vinh.jpeg\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p>Shopee cũng công bố chương trình <strong>“Mỗi xã một sản phẩm” (OCOP)</strong> với mục tiêu hỗ trợ ít nhất 50 hợp tác xã nông nghiệp trên toàn quốc trong năm 2025.</p>\n<p>Người tiêu dùng hiện đã có thể tìm mua nông sản chính gốc Trà Vinh dễ dàng ngay tại nhà, với ưu đãi vận chuyển và mã giảm giá độc quyền trên Shopee.&nbsp;</p>\n','http://localhost:8000/uploads/avatars/681caa01ef273_06.jpg',12,'2025-04-04 17:44:35',29),(11,'Trường Đại học Bách khoa - Đại Học Quốc Gia TP. Hồ Chí Minh hợp tác Shopee triển khai học kỳ doanh nghiệp','<h2>HỌC KỲ DOANH NGHIỆP: ĐẠI HỌC BÁCH KHOA x SHOPEE</h2>\n<h3>Giới thiệu chương trình</h3>\n<p>Học kỳ doanh nghiệp là mô hình đào tạo tiên tiến, trong đó sinh viên năm 3 và năm cuối có cơ hội <strong>học tập – làm việc thực tế tại doanh nghiệp đối tác</strong> trong suốt 1 học kỳ chính thức. Với sự hợp tác chiến lược giữa Trường Đại học Bách Khoa (ĐHBK) và Shopee, chương trình mang đến một môi trường trải nghiệm toàn diện cho sinh viên trong lĩnh vực <strong>Thương mại điện tử, Kỹ thuật phần mềm, Logistics, Trí tuệ nhân tạo và Phân tích dữ liệu</strong>.</p>\n<h3>Mục tiêu</h3>\n<ul>\n<li>Giúp sinh viên áp dụng kiến thức chuyên ngành vào thực tiễn tại môi trường Shopee – một trong những tập đoàn công nghệ thương mại điện tử hàng đầu Đông Nam Á.</li>\n<li>Phát triển kỹ năng mềm, kỹ năng giao tiếp, làm việc nhóm, quản lý thời gian và giải quyết vấn đề thực tế.</li>\n<li>Tạo cơ hội thực tập, mở rộng cơ hội nghề nghiệp sau khi tốt nghiệp.</li>\n</ul>\n<h3>Nội dung học kỳ</h3>\n<ul>\n<li><strong>Vị trí thực tập</strong>: Frontend Developer, Backend Developer, Data Analyst, DevOps Engineer, Logistics Operations, v.v.</li>\n<li><strong>Hình thức</strong>: Làm việc full-time tại văn phòng Shopee Hồ Chí Minh hoặc hybrid (tuỳ vị trí).</li>\n<li><strong>Mentorship</strong>: Mỗi sinh viên được phân công mentor là quản lý hoặc kỹ sư cao cấp tại Shopee.</li>\n<li><strong>Đánh giá</strong>: Kết quả được chuyển hoá thành tín chỉ học phần, có báo cáo chuyên đề, phản hồi từ doanh nghiệp và giảng viên hướng dẫn.</li>\n</ul>\n<h3>Đối tượng tham gia</h3>\n<ul>\n<li>Sinh viên năm 3–4 khoa: <strong>Khoa học Máy tính</strong>, <strong>Công nghệ Thông tin</strong>, <strong>Hệ thống Công nghiệp</strong>, <strong>Logistics và Quản lý Chuỗi cung ứng</strong>, <strong>Toán Tin ứng dụng</strong>,...</li>\n<li>GPA từ 2.5 trở lên, có đam mê với sản phẩm và công nghệ thực tế.</li>\n<li>Ưu tiên sinh viên đã có kỹ năng lập trình cơ bản, tư duy logic và tinh thần học hỏi cao.</li>\n</ul>\n<h3>Quy trình đăng ký</h3>\n<ol>\n<li><strong>Đăng ký online</strong> qua hệ thống trường hoặc website Shopee Careers.</li>\n<li><strong>Phỏng vấn sơ tuyển</strong> cùng đại diện Shopee (có thể online).</li>\n<li><strong>Thông báo kết quả</strong> trước khi bắt đầu học kỳ.</li>\n<li><strong>Ký cam kết đào tạo &amp; kế hoạch công việc cụ thể</strong> giữa sinh viên – trường – Shopee.</li>\n</ol>\n<h3>Quyền lợi sinh viên</h3>\n<ul>\n<li>Trợ cấp thực tập hấp dẫn (tuỳ vị trí).</li>\n<li>Cơ hội <strong>ở lại làm việc chính thức tại Shopee</strong> sau khi tốt nghiệp.</li>\n<li>Tham gia các workshop nội bộ, training kỹ năng và demo dự án.</li>\n<li>Chứng nhận thực tập từ Shopee và điểm học phần từ Bách Khoa.</li>\n</ul>\n<h3>Liên hệ</h3>\n<p><strong>Phòng Công tác Sinh viên &amp; Quan hệ Doanh nghiệp – Trường ĐHBK</strong><br><br>268 Lý Thường Kiệt, Quận 10, TP.HCM<br><br><a href=\"\" target=\"_self\">ctsv@hcmut.edu.vn</a> | (028) 3865 4183&nbsp;</p>\n','http://localhost:8000/uploads/avatars/681caab8e0cd6_Doi-ngu-nhan-su-OISP-2022.jpg',12,'2025-05-07 17:44:35',42),(12,'Shopee Là Gì? Lịch Sử, Mô Hình, Chiến Lược và Sự Thống Trị','<p>Bài viết thứ ba được cập nhật với nhiều thông tin chi tiết và hình ảnh minh họa.</p>\n','http://localhost:8000/uploads/avatars/681cab1a38f3b_26c9324913c021677768.png',12,'2025-04-04 17:44:35',6),(15,'Từ tiệm tạp hóa nhỏ đến shop 5 sao trên Shopee – Hành trình của chị Hoa tại Đồng Nai','<blockquote></blockquote>\n<p>“Lúc đầu tôi còn không biết mở gian hàng Shopee ở đâu. Vậy mà giờ đơn hàng về mỗi ngày, con trai phải phụ mẹ gói hàng suốt buổi chiều” – chị Hoa cười chia sẻ.</p>\n<h3>Khởi đầu từ một góc phố nhỏ ở TP. Biên Hòa</h3>\n<p>Nằm ngay mặt tiền một con đường nhỏ thuộc phường Tân Hiệp, tiệm tạp hóa của chị Hoa từng chỉ bán hàng cho bà con quanh xóm. Hàng hóa chủ yếu là bánh kẹo, đồ khô, gia vị truyền thống – những mặt hàng tưởng chừng đơn giản nhưng lại là đặc sản của vùng Đồng Nai như <strong>muối tôm, khô cá dứa, mắm nêm</strong>...</p>\n<p>Khi dịch COVID-19 bùng phát, lượng khách giảm mạnh, thu nhập gia đình chị Hoa cũng tụt dốc. Chính lúc đó, con trai chị – sinh viên đại học – đã đề xuất mẹ thử bán hàng online. Ban đầu chị rất lo lắng vì <strong>không biết công nghệ, không biết chụp ảnh, không biết ghi mô tả sản phẩm.</strong>&nbsp;</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca89462a9c_5-17433119333771682788963.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<h3>Một bước ngoặt đến từ khóa học miễn phí của Shopee</h3>\n<p>Tháng 8/2022, chị Hoa đăng ký một buổi tập huấn trực tuyến của Shopee dành cho nhà bán hàng mới. Tại đây, chị được hướng dẫn cách tạo gian hàng, chụp ảnh bằng điện thoại, đặt tên sản phẩm hấp dẫn và cách gói hàng đúng chuẩn.</p>\n<blockquote></blockquote>\n<p>“Shopee hướng dẫn rất tận tình. Tôi chỉ cần làm theo là thấy hiệu quả liền”, chị Hoa nói.</p>\n<p>Chỉ sau 1 tuần, shop của chị đã có đơn đầu tiên: <strong>1 hũ muối tôm 50.000đ giao về TP.HCM.</strong> Chị vừa hồi hộp vừa vui mừng, cẩn thận gói hàng và viết tay dòng chữ: “Cảm ơn bạn đã ủng hộ quán nhỏ của mẹ Hoa!”.&nbsp;</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca8a9a90e6_cover_2.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<h3>&nbsp;Từ 1 đến 1.000 đơn hàng – và 5 sao uy tín</h3>\n<p>Nhờ chăm chỉ phản hồi khách hàng, giữ chất lượng ổn định và gói hàng cẩn thận, shop chị Hoa dần nhận được <strong>nhiều đánh giá 5 sao</strong>. Sản phẩm “muối tôm đặc biệt – vị Đồng Nai” sau 3 tháng đã nằm trong top sản phẩm đặc sản bán chạy tại khu vực miền Nam.</p>\n<p>Hiện tại, shop của chị có hơn <strong>1.200 đơn hàng mỗi tháng</strong>, với doanh thu ổn định gần <strong>30 triệu đồng</strong>. Con trai chị phụ mẹ xử lý đơn, chụp ảnh sản phẩm mới và tư vấn khách trên Shopee Live.&nbsp;</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca8ca76085_co-so-kinh-doanh-man-hinh-17227722145091739677921-1722781721891-1722781722202315313846.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<h3>Lời nhắn của chị Hoa đến các tiểu thương địa phương:</h3>\n<blockquote></blockquote>\n<p>“Mình có sản phẩm ngon, chất lượng thì đừng ngại mang lên mạng bán. Shopee không quá khó, quan trọng là mình chịu học và chăm chút từng đơn. Từ tiệm nhỏ như tôi mà còn lên được, thì ai cũng làm được hết!”&nbsp;</p>\n<h3>&nbsp;Bạn có muốn bắt đầu hành trình như chị Hoa?</h3>\n<p>Đăng ký bán hàng ngay tại: <a href=\"\" target=\"_new\">https://banhang.shopee.vn</a><br><br>Hoặc tham gia <strong>lớp học miễn phí</strong> do Shopee Đồng Nai tổ chức hàng tháng tại Trung tâm Hỗ trợ Nhà Bán Hàng (246 Nguyễn Ái Quốc, Biên Hòa).&nbsp;</p>\n','http://localhost:8000/uploads/avatars/681ca879b644f_5ffcbf26-4f41-471d-9f9e-dcdcbbb06231.png',12,'2025-04-04 17:44:47',11),(17,'Hành trình Shopee xây \'bệ phóng\' đưa hàng Việt vươn xa','<h2 style=\"text-align:start;\"></h2>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 17px;font-family: Merriweather;\">Từ doanh nghiệp truyền thống đến khởi nghiệp địa phương, mỗi câu chuyện đều là hành trình mang đậm dấu ấn đổi mới, nâng tầm giá trị hàng hóa \'made in Vietnam\' của Shopee.</span></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 17px;font-family: Inter;\">Đi từ ý tưởng \"số hóa\" sản vật địa phương và lan tỏa câu chuyện văn hóa vùng miền, Shopee giới thiệu nhiều sáng kiến cộng đồng nổi bật trong năm 2024. Đến nay, sàn đã đào tạo kỹ năng TMĐT cho hơn 20.000 doanh nghiệp từ 30 tỉnh thành. Song, không chỉ đồng hành chuyển đổi số, Shopee còn thắp sáng khát vọng vươn lên của người Việt, thúc đẩy phát triển kinh tế địa phương bền vững và giúp thương hiệu Việt tự tin khẳng định giá trị trên trường quốc tế.</span></p>\n<h2 style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 20px;font-family: Inter;\">Livestream - cánh cửa kết nối người dùng và thương hiệu Việt</span></h2>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca817d4a6a_1-17433120325351101845043.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 17px;font-family: Inter;\">11g30 ngày 15.4.2024, tập khởi động của \"Tinh hoa Việt Du Ký\" chính thức lên sóng, mở đường cho sáng kiến giới thiệu sản phẩm đặc trưng vùng miền giá tốt của Shopee.</span></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 17px;font-family: Inter;\">Vượt khỏi khuôn khổ livestream bán hàng thông thường, chương trình mang đến \"bản đồ\" trải nghiệm văn hóa - ẩm thực đặc sắc tại 20 tỉnh thành. Thông qua hoạt động tương tác thú vị, người xem như hòa mình vào không gian sống địa phương, cảm nhận nét đẹp văn hóa, ẩm thực độc đáo mỗi vùng miền.</span></p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca820ac37d_2-1743311933462105863193.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(41,41,41);background-color: rgb(255,255,255);font-size: 17px;font-family: Inter;\">Cùng lúc đó, chương trình \"Đại tiệc livestream trái cây\" cũng gây tiếng vang khi đưa người xem về tận vườn, lắng nghe câu chuyện của nông dân và tìm hiểu nguồn gốc các thức quả địa phương.</span>&nbsp;</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca826f151c_3-174331193344660949466.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n','http://localhost:8000/uploads/avatars/681ca8033ebf0_1-17433120325351101845043.webp',12,'2025-05-08 08:44:16',6),(18,'SHOCK! Sale mừng đại lễ 30/4 - Shopee mở chi ở Đồng Nai???','<p>Nhân dịp chào mừng ngày Giải phóng miền Nam 30/4 và Quốc tế Lao động 1/5, Shopee chính thức khai trương chi nhánh mới tại trung tâm thành phố Biên Hòa, Đồng Nai, đánh dấu bước phát triển chiến lược tại khu vực Đông Nam Bộ.</p>\n<p>Buổi lễ khai trương diễn ra vào sáng ngày 30/4 tại địa chỉ 246 Nguyễn Ái Quốc, P. Tân Tiến, TP. Biên Hòa, với sự góp mặt của đông đảo đối tác địa phương, nhà bán hàng, cùng khách mời là các doanh nghiệp vừa và nhỏ đang hoạt động trên nền tảng Shopee.</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca5ea53204_maxresdefault.jpg\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p>Đại diện Shopee Việt Nam chia sẻ:<br><em>\"Đồng Nai là một trong những tỉnh có tốc độ tăng trưởng thương mại điện tử mạnh mẽ nhất khu vực phía Nam. Việc mở rộng chi nhánh tại đây sẽ giúp Shopee hỗ trợ tốt hơn các nhà bán hàng địa phương trong việc vận hành, đào tạo kỹ năng bán hàng online, và kết nối với người tiêu dùng trên toàn quốc.\"</em></p>\n<p>Bên cạnh các hoạt động khai trương, Shopee Đồng Nai còn triển khai hàng loạt chương trình ưu đãi mừng đại lễ:</p>\n<p>Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng từ Đồng Nai</p>\n<p>Mã giảm giá 50K cho đơn từ 250K khi mua sắm trong ngày 30/4 – 1/5</p>\n<p>Tặng voucher Shopee Live trị giá 100K cho 50 khách hàng check-in tại chi nhánh mới</p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681ca616daa91_491046916_969436245612343_3519291637556804776_n.jpg\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p>Ngoài ra, Shopee cũng cam kết đẩy mạnh hỗ trợ các sản phẩm đặc trưng của Đồng Nai như điều rang muối, chả lụa Long Khánh, trái cây sạch Xuân Lộc... thông qua các chương trình “Sản phẩm địa phương – Vươn ra thế giới” trong thời gian tới.&nbsp;</p>\n','http://localhost:8000/uploads/avatars/681ca68ba2338_493266729_1318890099688772_7632862180145229655_n.jpg',12,'2025-05-08 10:24:48',17),(21,'Bán hàng online bắt đầu từ đâu??','<p style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);\">Có rất nhiều lựa chọn về kênh và cách tiếp cận để bắt đầu bán hàng online hoặc đẩy mạnh doanh số. Tuy nhiên, bán hàng online trên Shopee là một ý tưởng lý tưởng nếu bạn muốn kinh doanh sản phẩm mới, phát triển doanh nghiệp và tiếp cận một lượng khách hàng lớn. lớn</span></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);\">rất hay</span></p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681d6b1813c23_jack.webp\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);\">Trong bài viết này, Shopee Uni sẽ đưa ra các mẹo chung về cách bán hàng online cho người mới bắt đầu một cách hiệu quả. Làm thế nào để tận dụng và tiếp cận tệp khách hàng tiềm năng hiện có trên Shopee để thúc đẩy doanh số online? Cùng tìm hiểu nhé!</span></p>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);\">Dù bạn đang muốn kinh doanh sản phẩm, mặt hàng gì, bạn cũng có thể bắt đầu bán hàng online tại nhà. Sau đây là cách bắt đầu:</span></p>\n<p></p>\n<img src=\"http://localhost:8000/uploads/avatars/681d6b1d1da77_jack_card_bo_goc.png\" alt=\"undefined\" style=\"height: ;width: \"/>\n<p></p>\n<p style=\"margin-left:0px;\"><br>&nbsp;</p>\n','http://localhost:8000/uploads/avatars/681cbc5f55d50_a49b52aa5f7d5ac0200807669fffe0d1.png',4,'2025-05-08 14:15:05',20);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `productID` int NOT NULL,
  `userID` int NOT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL,
  `buyNow` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_userID` (`userID`),
  KEY `FK_productID` (`productID`),
  CONSTRAINT `FK_productID` FOREIGN KEY (`productID`) REFERENCES `products` (`id`),
  CONSTRAINT `FK_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (9,1,5,7,1000000.00,NULL),(28,1,6,5,1000000.00,NULL),(32,2,6,1,1000000.00,NULL),(34,2,18,1,36000000.00,NULL),(35,1,16,6,100000.00,NULL),(41,1,8,9,100000.00,NULL),(43,2,3,1,1000000.00,NULL);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `product_id` int DEFAULT NULL,
  `status` enum('read','unread') NOT NULL DEFAULT 'unread',
  `is_deleted_sender` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted_receiver` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (3,NULL,1,2,'Dạo này sao rồi bồ, vẫn khỏe chứ?','2025-04-10 10:10:00',NULL,'read',0,0),(4,NULL,2,1,'Tôi khỏe chán kk','2025-04-10 10:15:00',NULL,'read',0,0),(11,NULL,7,8,'Chào shop, em muốn hỏi thêm về sản phẩm bên mình ạ','2025-04-12 08:00:00',NULL,'read',0,0),(12,NULL,8,7,'Chào bạn, không biết là mình cần thêm thông tin gì ạ?','2025-04-12 08:05:00',NULL,'read',0,0),(13,NULL,7,8,'À được rồi ạ, làm phiền shop rôi','2025-04-12 08:10:00',NULL,'unread',1,0),(18,NULL,2,1,'Ê bồ','2025-05-01 10:05:00',NULL,'read',0,0),(38,NULL,1,2,'Sao thế tui nghe','2025-05-01 14:35:14',NULL,'read',0,0),(51,NULL,1,2,'Aloo đâu rồi','2025-05-05 15:28:22',NULL,'read',0,0),(52,NULL,1,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-08 16:26:53',NULL,'read',0,0),(54,NULL,1,3,'shop ơiii','2025-05-08 23:31:31',NULL,'read',0,0),(55,NULL,1,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 01:08:46',NULL,'read',0,0),(56,NULL,3,1,'ok bạn ei','2025-05-09 01:17:32',NULL,'read',0,0),(57,NULL,1,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 07:19:38',NULL,'read',0,0),(58,NULL,2,1,'tui đây bạn ơi','2025-05-09 07:32:31',NULL,'read',0,0),(60,NULL,8,7,'bạn ơi','2025-05-09 07:51:33',NULL,'unread',0,0),(61,NULL,5,8,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:11:40',NULL,'read',0,0),(62,NULL,5,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:11:40',NULL,'read',0,0),(63,NULL,1,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:30:49',NULL,'read',0,0),(64,NULL,1,8,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:30:49',NULL,'read',0,0),(65,NULL,6,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:57:03',NULL,'read',0,0),(66,NULL,6,8,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 08:57:03',NULL,'read',0,0),(67,NULL,3,6,'oke','2025-05-09 08:58:23',NULL,'unread',0,0),(68,NULL,9,8,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 09:06:44',NULL,'unread',0,0),(69,NULL,9,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 09:06:44',NULL,'unread',0,0),(70,NULL,5,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 09:08:24',NULL,'unread',0,0),(71,NULL,1,3,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 09:13:08',NULL,'read',0,0),(72,NULL,1,14,'Chào shop, tôi vừa đặt mua sản phẩm của bạn','2025-05-09 09:13:08',NULL,'read',0,0),(73,NULL,14,1,'Chào bạn Tuấn, cảm ơn bạn đã ủng hộ shop ^^','2025-05-09 09:14:05',NULL,'unread',0,0),(74,NULL,8,1,'shop xin cảm ơn Tuấn','2025-05-09 09:15:29',NULL,'read',0,0),(75,NULL,8,6,'Shop chào bạn, cảm ơn bạn đã mua sản phẩm','2025-05-09 09:15:50',NULL,'unread',0,0),(76,NULL,3,1,'chào bạn','2025-05-09 09:25:57',NULL,'unread',0,0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,250000.00),(2,1,3,1,300000.00),(3,2,2,1,150000.00),(4,3,1,2,250000.00),(5,3,2,1,150000.00),(6,3,3,1,300000.00),(7,4,1,2,100000.00),(8,4,2,1,200000.00),(9,13,5,2,1000000.00),(10,14,5,2,1000000.00),(11,15,5,2,1000000.00),(12,16,5,2,1000000.00),(13,17,7,1,1000000.00),(14,18,7,1,1000000.00),(15,19,8,2,100000.00),(16,20,5,1,1000000.00),(17,21,3,1,1000000.00),(18,22,17,1,200000.00),(19,22,10,1,100000.00),(20,23,8,1,100000.00),(21,23,19,1,850000.00),(22,24,15,1,100000.00),(23,24,17,1,200000.00),(24,25,17,1,200000.00),(25,25,19,1,850000.00),(26,25,9,2,123000.00),(27,26,8,2,100000.00),(28,27,9,2,123000.00),(29,27,21,1,250000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,2,550000.00,'delivered','2025-05-01 10:00:00','2025-05-09 01:37:28'),(2,1,1,150000.00,'shipped','2025-05-05 14:20:00','2025-05-09 01:37:30'),(3,2,4,1000000.00,'shipped','2025-05-07 09:15:00','2025-05-09 01:37:31'),(4,1,3,400000.00,'delivered','2025-05-08 17:31:59','2025-05-09 01:55:16'),(13,1,2,2000000.00,'delivered','2025-05-08 17:46:19','2025-05-09 01:37:45'),(14,1,2,2000000.00,'delivered','2025-05-08 17:46:33','2025-05-09 01:37:46'),(15,1,2,2000000.00,'shipped','2025-05-08 17:47:45','2025-05-09 01:37:50'),(16,1,2,2000000.00,'pending','2025-05-08 17:49:04','2025-05-08 15:49:07'),(17,1,1,1000000.00,'shipped','2025-05-09 00:55:52','2025-05-09 01:37:48'),(18,1,1,1000000.00,'pending','2025-05-08 23:25:59','2025-05-09 01:55:21'),(19,1,2,200000.00,'pending','2025-05-08 23:26:48','2025-05-08 16:26:51'),(20,1,1,1000000.00,'cancelled','2025-05-09 01:08:45','2025-05-09 01:55:24'),(21,1,1,1000000.00,'shipped','2025-05-09 07:19:36','2025-05-09 01:37:41'),(22,5,2,300000.00,'shipped','2025-05-09 08:11:37','2025-05-09 01:37:39'),(23,1,2,950000.00,'shipped','2025-05-09 08:30:47','2025-05-09 01:37:40'),(24,6,2,300000.00,'pending','2025-05-09 08:57:00','2025-05-09 01:57:00'),(25,9,4,1296000.00,'pending','2025-05-09 09:06:41','2025-05-09 02:06:41'),(26,5,2,200000.00,'pending','2025-05-09 09:08:22','2025-05-09 02:08:22'),(27,1,3,496000.00,'pending','2025-05-09 09:13:05','2025-05-09 02:13:05');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categories` int DEFAULT NULL,
  `shippingTime` int DEFAULT NULL,
  `typeWithImage` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,3,'Giày bóng đá adidas','Giày bóng đá siêu vip',2000000.00,100,'2025-05-06 10:22:42','2025-05-08 09:07:51',0,3,'/uploads/productImage/DucPhat.png',1),(2,3,'Giày bóng đá nike','Giày bóng đá siêu vip',1000000.00,100,'2025-04-26 10:22:42','2025-05-08 09:08:02',0,3,'/uploads/productImage/Yuigahama_Yui.jpg',1),(3,3,'abcsadsadasđạkdsakjdkjấdssadádsadasd','Giày bóng đá siêu vip',1000000.00,100,'2025-04-26 10:28:03','2025-05-09 02:33:20',0,3,'/uploads/productImage/Yuigahama_Yui.jpg',0),(4,3,'Giày bóng đá','Giày bóng đá siêu vip',1000000.00,100,'2025-05-01 01:43:26','2025-05-08 09:08:05',0,3,'/uploads/productImage/Yuigahama_Yui.jpg',1),(5,3,'Mô hình waifu','Waifu siêu cấp 1',1000000.00,100,'2025-05-07 10:43:03','2025-05-09 00:22:29',0,3,'/uploads/productImage/waifu1.jpeg',0),(6,3,'Rem Figure','Giày bóng đá siêu vip',1000000.00,100,'2025-05-07 10:43:54','2025-05-09 00:22:45',0,3,'/uploads/productImage/waifu2.jpg',0),(7,3,'Waifu 3','Waifu siêu cấp 3',1000000.00,100,'2025-05-07 10:45:12','2025-05-07 11:58:55',0,3,'/uploads/productImage/waifu3.webp',0),(8,3,'Đồ chơi búp bê','Đồ chơi búp bê cục chất',100000.00,20,'2025-05-08 07:53:00','2025-05-08 07:53:44',0,4,'/uploads/productImage/CongMinh.jpg',0),(9,3,'Mô hình OBITO','Mô Hình OBITO 3d',123000.00,7,'2025-05-08 07:54:29','2025-05-08 07:54:29',0,4,'/uploads/productImage/ThanhPhong.jpg',0),(10,3,'Mô hình anime','Mô hình anime chính hãng từ Nhật Bản',100000.00,30,'2025-05-08 10:21:05','2025-05-08 10:21:05',0,4,'/uploads/productImage/avatar1.jpg',0),(11,3,'Áo thun in hình thần tượng J97','Áo thun cực chất dành cho đom đóm',5000000.00,3,'2025-05-08 18:26:47','2025-05-09 01:44:06',0,7,'/uploads/productImage/ao-j97.jpg',0),(12,3,'Poster J97','Poster Thần Tượng',5000.00,198,'2025-05-08 18:27:50','2025-05-09 01:41:39',0,1,'/uploads/productImage/jack_poster.webp',1),(13,3,'Card bo góc J97','Card bo góc',123000.00,1000,'2025-05-08 18:32:13','2025-05-09 00:14:50',0,2,'/uploads/productImage/cardbogoc.webp',1),(14,3,'Card bo góc J97','Card bo góc',123000.00,1000,'2025-05-09 00:15:10','2025-05-09 01:44:32',0,2,'/uploads/productImage/card-h97.jpg',0),(15,3,'Mô Hình Gojo Satoru','Mô hình chú thuật sư',100000.00,20,'2025-05-09 00:17:47','2025-05-09 01:43:26',0,3,'/uploads/productImage/gojo.jpg',0),(16,3,'Móc khóa Tung Tung Sahour','Móc khóa brainrot',100000.00,300,'2025-05-09 00:20:20','2025-05-09 01:42:23',0,3,'/uploads/productImage/tuntung.jpg',0),(17,8,'Máy tính Casio MX-12B để bàn','Máy tính bỏ túi Casio MX-12B chính hãng',200000.00,150,'2025-05-09 00:53:28','2025-05-09 00:54:13',0,5,'/uploads/productImage/maytinhbotui.jpg',0),(18,8,'Laptop Gaming MSI Katana','màn hình xịn xò, rẻ nhất tầm giá',18000000.00,20,'2025-05-09 00:58:13','2025-05-09 00:58:13',0,7,'/uploads/productImage/msi_katana_15_b13_60fefcc66a.png',0),(19,8,'Chuột Gaming Logitech G502 Hero','Được trang bị cảm biến quang học HERO',850000.00,50,'2025-05-09 01:00:39','2025-05-09 01:00:39',0,4,'/uploads/productImage/logitech.png',0),(20,14,'Thép xịn 16','không',32000.00,198,'2025-05-09 02:10:46','2025-05-09 02:10:46',0,2,'/uploads/productImage/unnamed-5.jpg',0),(21,14,'Dao bếp','làm từ thép không gỉ 99%',250000.00,300,'2025-05-09 02:11:30','2025-05-09 02:11:30',0,2,'/uploads/productImage/7f72b5570ab7094b2739266f50feb822.jpg',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text,
  `asker_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `asker_id` (`asker_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`asker_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (7,'Quy trình đặt hàng bên shop thế nào ?','Làm theo hướng dẫn shop để bên dưới sản phẩm nhé',1),(8,'Từ khi xác nhận đặt hàng, thì bao lâu hàng mới được giao đến địa chỉ của tôi ?','Sau khi đơn hàng được xác nhận thành công, thời gian giao hàng sẽ dao động từ 1 đến 5 ngày làm việc, tùy thuộc vào khu vực giao hàng và phương thức vận chuyển bạn đã chọn.\n- Nội thành các thành phố lớn (như Hà Nội, TP.HCM): thời gian giao hàng thường từ 1–2 ngày.\n- Ngoại thành và tỉnh thành khác: giao hàng trong vòng 3–5 ngày.\nVới các chương trình khuyến mãi lớn hoặc dịp cao điểm, thời gian có thể chậm hơn đôi chút — chúng tôi sẽ thông báo trước nếu có thay đổi. Bạn có thể theo dõi trạng thái đơn hàng trong mục \"Đơn hàng của tôi\" trên website hoặc ứng dụng.',1),(9,'Hàng của tôi có thời hạn bảo hành trong thời gian bao lâu ?',NULL,1),(10,'Sau khi mua hàng bên shop thì tôi có thể đổi trả về sau không ?','Có, bạn hoàn toàn có thể đổi hoặc trả hàng sau khi mua, với điều kiện sản phẩm còn nguyên vẹn, chưa qua sử dụng và nằm trong thời hạn đổi trả là 7 ngày kể từ ngày nhận hàng.\nChúng tôi hỗ trợ đổi trả trong các trường hợp như: sản phẩm bị lỗi kỹ thuật do nhà sản xuất, giao sai sản phẩm sai mẫu hoặc thiếu hàng, hàng bị hư hỏng trong quá trình vận chuyển... Lưu ý: Không áp dụng đổi trả với các sản phẩm nằm trong danh mục không hỗ trợ hoàn trả (ví dụ: đồ lót, sản phẩm giảm giá sâu, hàng dùng thử…).\n',1),(11,'Tôi có thể thanh toán bằng hình thức nào ?','Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, MasterCard), ví điện tử (Momo, ZaloPay), chuyển khoản ngân hàng và COD (thanh toán khi nhận hàng).',1),(12,'Sau khi đặt hàng, tôi có thể hủy hoặc thay đổi đơn hàng không ?',NULL,1),(13,'Chi phí vận chuyển được tính như thế nào ?','Phí vận chuyển phụ thuộc vào khối lượng hàng và địa chỉ nhận. Chúng tôi miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên (nội thành).',1),(14,'Tôi có được kiểm tra hàng trước khi thanh toán không ?','Có, bạn có thể yêu cầu kiểm tra hàng trước khi thanh toán đối với đơn hàng COD. Vui lòng thông báo với nhân viên giao hàng khi nhận hàng.',1),(15,'Nếu sản phẩm bị lỗi hoặc không đúng, tôi phải làm gì ?','gghfh',1),(16,'Tôi có thể theo dõi đơn hàng của mình ở đâu ?','Sau khi đặt hàng, bạn có thể theo dõi tình trạng đơn hàng trong mục “Đơn hàng của tôi” khi đăng nhập tài khoản. Ngoài ra, chúng tôi sẽ gửi thông báo qua email/SMS khi đơn hàng được xử lý và vận chuyển.',1);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('buyer','seller','manager') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `details` text,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Trịnh Trần Phương Tuấn','test@gmail.com','$2a$10$47kH9UXhuQktmenviDov8eQpb4.FGw53CKZyu2q2bF7PWldg80i8m','buyer','2025-03-17 05:58:21','/uploads/avatars/j97.jpg','','Bến Tre','2013-05-06',10797312.00),(2,'Đặng Tiến Hoàng','test1@gmail.com','$2y$10$Nyi0IZUCLAV5bC4E5meD8up8dHJ2IHDu15cUGImWLBGjD.Lo2uAqq','buyer','2025-04-03 03:15:16','/uploads/avatars/11-37.jpg','','Hà Nội','1988-05-08',0.00),(3,'Văn phòng phẩm','student@gmail.com','$2y$10$rTlurlJ22feC6GgwWlgAcuuX3Scd19B.9k3c2oaMzJo7faj5cXTuq','seller','2025-04-03 03:15:36','/uploads/avatars/gojo.jpg','Là 1 cửa hàng chuyên về các dụng cụ học tập cho học sinh các cấp 1, 2, 3...','Hẻm 43, đường Hai Bà Trưng, xã Kiến Hào, huyện Đông An, tỉnh Nà Nam','2012-06-20',0.00),(4,'admin','student3@gmail.com','$2y$10$sIIyPyB9IeT.vz3uBcTgVO6BhaXXso.oCHZ69SV9gdSPSPJlYpRjS','manager','2025-04-03 04:25:53','/uploads/avatars/K19A1_1.jpg','','','2004-06-29',0.00),(5,'Son Heung-min','student6@gmail.com','$2y$10$CeEs8U76YNIA7whZ3GXoduIxeIzcYyImAR7X2tVxe.8Fqej3oV0li','buyer','2025-04-03 04:26:44','/uploads/avatars/pic2.jpg','','','2006-01-09',0.00),(6,'clearwind','test123@gmail.com','$2y$10$hEL0/BLOBIQtZtI8UVJORe40fLhTWrwC7pqurWY9soo4U2fzyN4Fu','buyer','2025-04-03 06:40:44','/uploads/avatars/___nh_th____4x6_2022.JPG','','','2025-05-07',100000.00),(7,'cra','nghiavo6777@gmail.com','$2y$10$EdrYjXS7AflfCUDlVCVBLebQRmsP7AYQ06jFGetsBohoOEhjiEqP2','buyer','2025-04-04 15:40:39',NULL,'','TAM AN','2004-11-13',100.00),(8,'GEARVN','student2@gmail.com','$2y$10$FGD0wAQdCglhUwu65FtfXeUVRRvt4MOHCHvfA3dsrSd5rapXOnhZa','seller','2025-04-07 03:56:02','/uploads/avatars/images.jpg','','KTX Khu B, ĐHQG TP.HCM, Dĩ An, Bình Dương','2016-02-02',0.00),(9,'Sinh viên HCMUT','test13@gmail.com','$2y$10$XPWo2wJCwSTh7/GyVqUSOuQgP0TCucu1Q.Njls5Evyc4HW476KztK','buyer','2025-04-07 03:56:37','/uploads/avatars/akatsuki_team.jpg','','Hồ Chí Minh','2006-08-13',2704000.00),(10,'hiii','test1345@gmail.com','$2y$10$kfIpzxBbHLwtXO6Z9OXgquJgWR/Cb5GcWygN/qqfMUc8TDt3VYbCO','buyer','2025-04-07 03:58:34',NULL,NULL,'Ho Chi Minh','2006-08-13',0.00),(12,'nghia','nghiavo1304@gmail.com','$2y$10$QVH5R.1UuXmZdBomeqHBGuMtzDCfYlyjvXQCD/O7Kbc1NHJJJd.R6','manager','2025-05-01 08:51:16','/uploads/avatars/fa786d1a-8449-420b-b707-bb0ef3511304.jfif','','20 Nguyễn Hữu Cảnh, TT. Long Thành, Long Thành, Đồng Nai','2004-11-13',0.00),(13,'eee','john.doe@example.com','$2y$10$INyvd1DzXg4xBriDFxziJ.aJSMvw/E4e5R2xpReQy97okrTX0wClK','buyer','2025-05-07 10:32:46',NULL,NULL,'KTX Khu B, ĐHQG TP.HCM, Dĩ An, Bình Dương','2025-05-08',0.00),(14,'Thép Hòa Phát','nhuy@gmail.com','$2y$10$yd4pqXoZbbBxz3LZKwu6jeVYgOBNpFmd1XZlt1aUBZ7wWzAs92o82','seller','2025-05-08 12:24:46','/uploads/avatars/sat-thep-hoa-phat-2747.jpeg','','NTT','2007-08-05',0.00);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 11:35:30
