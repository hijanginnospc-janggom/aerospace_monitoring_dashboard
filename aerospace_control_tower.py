import sys
import webbrowser
import feedparser
import yfinance as yf
import threading
import urllib.parse
import ssl
from statistics import mean

from PyQt6.QtWidgets import (
    QApplication,
    QFrame,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QSplitter,
    QTabWidget,
    QTableWidget,
    QTableWidgetItem,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)
from PyQt6.QtCore import Qt, QTimer, pyqtSignal
from PyQt6.QtGui import QColor


class MetricCard(QFrame):
    def __init__(self, title: str, value: str = "--", subtitle: str = ""):
        super().__init__()
        self.setObjectName("metricCard")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(18, 16, 18, 16)
        layout.setSpacing(6)

        self.title_label = QLabel(title)
        self.title_label.setObjectName("metricTitle")
        self.value_label = QLabel(value)
        self.value_label.setObjectName("metricValue")
        self.subtitle_label = QLabel(subtitle)
        self.subtitle_label.setObjectName("metricSub")

        layout.addWidget(self.title_label)
        layout.addWidget(self.value_label)
        layout.addWidget(self.subtitle_label)

    def update_value(self, value: str, subtitle: str = ""):
        self.value_label.setText(value)
        self.subtitle_label.setText(subtitle)


class GlobalAerospaceControl(QMainWindow):
    news_received = pyqtSignal(list, list)
    market_received = pyqtSignal(dict)

    def __init__(self):
        super().__init__()
        self.company_db = self.build_company_db()
        self.news_links = []
        self.market_snapshot = {}

        self.news_received.connect(self.display_news)
        self.market_received.connect(self.display_market)

        self.init_ui()
        self.populate_lists()
        self.refresh_all()

    def build_company_db(self):
        return {
            "KAI": {"cat": "완제기", "name": "한국항공우주산업", "risk": "낮음", "desc": "KF-21, FA-50 양산 및 수출", "fin": "안정", "sales": "3.8조원", "type": "국내", "country": "대한민국", "item": "완제기(고정익/회전익)"},
            "Hanwha Aero": {"cat": "엔진/발사체", "name": "한화에어로스페이스", "risk": "낮음", "desc": "가스터빈 엔진 및 우주 발사체 제작", "fin": "안정", "sales": "9.3조원", "type": "국내", "country": "대한민국", "item": "항공기 엔진, 우주 발사체"},
            "LIG Nex1": {"cat": "유도무기", "name": "LIG넥스원", "risk": "낮음", "desc": "정밀 유도무기 및 레이더 시스템", "fin": "안정", "sales": "2.3조원", "type": "국내", "country": "대한민국", "item": "정밀유도무기, 항공전자"},
            "홍테크": {"cat": "정밀가공", "name": "홍테크", "risk": "낮음", "desc": "항공기 부품 정밀 가공 및 조립", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공기 기체 정밀 부품"},
            "현대코어테크": {"cat": "부품제조", "name": "현대코어테크", "risk": "보통", "desc": "항공기 엔진 및 기체 핵심 부품", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "엔진 부품, 정밀 기계 부품"},
            "데크카본": {"cat": "복합재", "name": "데크카본", "risk": "낮음", "desc": "탄소 복합재 브레이크 및 첨단 소재", "fin": "안정", "sales": "600억", "type": "국내", "country": "대한민국", "item": "탄소 복합재 브레이크 디스크"},
            "한양이엔지": {"cat": "설비/시스템", "name": "한양이엔지", "risk": "낮음", "desc": "반도체 및 우주항공 특수 가스 설비", "fin": "안정", "sales": "1조원", "type": "국내", "country": "대한민국", "item": "우주 발사체 지상지원 설비"},
            "비전collet": {"cat": "공구/체결", "name": "비전콜렛", "risk": "보통", "desc": "정밀 콜렛 및 공구 홀더 전문", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "정밀 콜렛, 기계 공구"},
            "신우시스템": {"cat": "부품제조", "name": "신우시스템", "risk": "보통", "desc": "항공기 기체 구조물 및 부품 가공", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "기체 구조물 부품"},
            "세기테크": {"cat": "부품제조", "name": "세기테크", "risk": "보통", "desc": "항공 부품 표면처리 및 정밀 가공", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공기 부품 표면처리"},
            "연중": {"cat": "기계부품", "name": "연중", "risk": "보통", "desc": "특수 정밀 부품 가공 전문", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "산업용 정밀 기계 부품"},
            "세종러버테크": {"cat": "고무/실링", "name": "세종러버테크", "risk": "보통", "desc": "항공/방산용 특수 고무 및 실링", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "특수 고무 씰, 가스켓"},
            "신금하": {"cat": "정밀가공", "name": "신금하", "risk": "보통", "desc": "항공기 부품 절삭 가공 및 조립", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "기체 구조 부품"},
            "에이앤브이": {"cat": "전자/시스템", "name": "에이앤브이", "risk": "보통", "desc": "항공 전자 및 시스템 제어 기술", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공 전자 장비"},
            "서우": {"cat": "부품제조", "name": "서우", "risk": "보통", "desc": "항공기 내부 부품 및 치공구 제작", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공용 치공구, 내장 부품"},
            "캠프": {"cat": "IT/솔루션", "name": "캠프", "risk": "보통", "desc": "항공 산업 특화 소프트웨어 및 관리 시스템", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "산업용 소프트웨어 솔루션"},
            "연암테크": {"cat": "정밀가공", "name": "연암테크", "risk": "낮음", "desc": "항공기 엔진 및 기체 핵심 부품 가공", "fin": "안정", "sales": "500억", "type": "국내", "country": "대한민국", "item": "엔진 하우징, 샤프트 부품"},
            "엔디티엔지니어링": {"cat": "기체구조", "name": "엔디티엔지니어링", "risk": "낮음", "desc": "민수 및 군용기 기체 구조물 조립", "fin": "안정", "sales": "800억", "type": "국내", "country": "대한민국", "item": "기체 주날개 및 꼬리날개 구조물"},
            "코오롱스페이스웍스": {"cat": "복합재", "name": "코오롱스페이스웍스", "risk": "낮음", "desc": "첨단 복합소재 기반 우주/항공 부품", "fin": "강력", "sales": "대기업계열", "type": "국내", "country": "대한민국", "item": "탄소섬유 복합재 구조물"},
            "지에스티산업": {"cat": "부품제조", "name": "지에스티산업", "risk": "보통", "desc": "항공기 유압 시스템 부품 제조", "fin": "안정", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "유압 라인 부품, 피팅"},
            "스페이스베이": {"cat": "우주항공", "name": "스페이스베이", "risk": "보통", "desc": "위성 시스템 및 소형 발사체 기술", "fin": "변동", "sales": "스타트업", "type": "국내", "country": "대한민국", "item": "위성 본체 부품, 발사체 모듈"},
            "발터이엔지": {"cat": "시스템", "name": "발터이엔지", "risk": "보통", "desc": "항공기 시험 설비 및 자동화 시스템", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공용 시험 장비"},
            "단암시스템즈": {"cat": "전자/통신", "name": "단암시스템즈", "risk": "낮음", "desc": "항공기용 전술 통신 및 항법 장치", "fin": "안정", "sales": "1,000억", "type": "국내", "country": "대한민국", "item": "항공기 통신 및 전시기 시스템"},
            "엘엔": {"cat": "부품제조", "name": "엘엔", "risk": "보통", "desc": "항공용 정밀 체결류 및 소형 부품", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "항공기용 스크류, 핀"},
            "테크론": {"cat": "정밀가공", "name": "테크론", "risk": "보통", "desc": "항공 부품 CNC 가공 및 조립", "fin": "보통", "sales": "미공개", "type": "국내", "country": "대한민국", "item": "정밀 가공품"},
            "Barnes Aerospace": {"cat": "부품제조", "name": "Barnes Group", "risk": "보통", "desc": "정밀 가공 부품 및 MRO 서비스", "fin": "안정", "sales": "12억$", "type": "해외", "country": "미국", "item": "엔진 부품, 기체 구조물"},
            "Kaman": {"cat": "복합재/기체", "name": "Kaman Corp", "risk": "보통", "desc": "특수 베어링 및 복합재 구조물", "fin": "보통", "sales": "7억$", "type": "해외", "country": "미국", "item": "항공용 베어링, 기체 부품"},
            "Magellan": {"cat": "엔진/기체", "name": "Magellan Aerospace", "risk": "보통", "desc": "항공기 엔진 모듈 및 구조물 설계", "fin": "보통", "sales": "8억C$", "type": "해외", "country": "캐나다", "item": "엔진 캐스팅, 기체 조립체"},
            "Constellium": {"cat": "원소재", "name": "Constellium", "risk": "보통", "desc": "고성능 알루미늄 압출 및 판재", "fin": "변동", "sales": "81억€", "type": "해외", "country": "프랑스", "item": "항공기용 알루미늄 판재"},
            "Alcoa": {"cat": "원소재", "name": "Alcoa", "risk": "높음", "desc": "알루미늄 제련 및 합금", "fin": "변동", "sales": "105억$", "type": "해외", "country": "미국", "item": "알루미늄 잉곳, 원자재"},
            "ATI": {"cat": "원소재", "name": "ATI (Allegheny Tech)", "risk": "보통", "desc": "티타늄 및 특수 합금 제조", "fin": "안정", "sales": "38억$", "type": "해외", "country": "미국", "item": "티타늄 합금, 니켈 소재"},
            "Norsk Hydro": {"cat": "원소재", "name": "Norsk Hydro", "risk": "낮음", "desc": "재생 에너지 기반 알루미늄 생산", "fin": "강력", "sales": "2,091억NOK", "type": "해외", "country": "노르웨이", "item": "알루미늄 압출재"},
            "Kobe Steel": {"cat": "원소재", "name": "Kobe Steel", "risk": "보통", "desc": "항공기용 티타늄 및 알루미늄 단조", "fin": "보통", "sales": "2.4조¥", "type": "해외", "country": "일본", "item": "티타늄 단조품, 특수강"},
            "Carpenter Tech": {"cat": "원소재", "name": "Carpenter Technology", "risk": "낮음", "desc": "고성능 특수 합금 및 분말 금속", "fin": "안정", "sales": "25억$", "type": "해외", "country": "미국", "item": "엔진용 특수 합금재"},
            "Hexcel": {"cat": "원소재", "name": "Hexcel", "risk": "낮음", "desc": "탄소섬유 및 복합소재 원천 기술", "fin": "안정", "sales": "19억$", "type": "해외", "country": "미국", "item": "탄소섬유 프리프레그"},
            "Solvay": {"cat": "원소재", "name": "Solvay", "risk": "낮음", "desc": "항공용 고분자 화학 소재 및 접착제", "fin": "강력", "sales": "134억€", "type": "해외", "country": "벨기에", "item": "항공 특수 화학소재"},
            "PCC": {"cat": "엔진/구조", "name": "Precision Castparts Corp.", "risk": "낮음", "desc": "대형 주조품 및 항공 패스너 전문", "fin": "강력", "sales": "브라이트", "type": "해외", "country": "미국", "item": "엔진 캐스팅, 대형 단조품"},
            "Doncasters": {"cat": "엔진부품", "name": "Doncasters Group", "risk": "보통", "desc": "정밀 주조 및 초합금 가공", "fin": "보통", "sales": "비공개", "type": "해외", "country": "영국", "item": "가스터빈 에어포일"},
            "Arconic": {"cat": "원소재", "name": "Arconic", "risk": "보통", "desc": "알루미늄 판재 및 시트 생산", "fin": "보통", "sales": "82억$", "type": "해외", "country": "미국", "item": "기체 구조용 알루미늄"},
            "LISI Aerospace": {"cat": "패스너", "name": "LISI Aerospace", "risk": "낮음", "desc": "항공용 고정밀 패스너 및 구조물", "fin": "안정", "sales": "14억€", "type": "해외", "country": "프랑스", "item": "항공용 볼트, 리벳"},
            "Stanley": {"cat": "패스너", "name": "Stanley Engineered Fastening", "risk": "낮음", "desc": "블라인드 리벳 및 특수 체결 솔루션", "fin": "안정", "sales": "그룹기반", "type": "해외", "country": "미국", "item": "항공용 리벳, 하드웨어"},
            "Howmet Aerospace": {"cat": "엔진부품", "name": "Howmet Aerospace", "risk": "낮음", "desc": "엔진용 블레이드 및 패스너 솔루션", "fin": "안정", "sales": "66억$", "type": "해외", "country": "미국", "item": "항공기 패스너, 티타늄 단조품"},
            "Boeing": {"cat": "완제기", "name": "보잉", "risk": "중간", "desc": "상용 및 군용기 제조", "fin": "주의", "sales": "778억$", "type": "해외", "country": "미국", "item": "여객기, 전투기"},
            "Airbus": {"cat": "완제기", "name": "에어버스", "risk": "낮음", "desc": "유럽 최대 항공기 제조사", "fin": "안정", "sales": "654억€", "type": "해외", "country": "프랑스/독일", "item": "상용기 전 기종"},
            "Lockheed Martin": {"cat": "유도무기", "name": "록히드마틴", "risk": "낮음", "desc": "스텔스기 및 우주 항공 시스템", "fin": "강력", "sales": "670억$", "type": "해외", "country": "미국", "item": "F-35, 미사일 시스템"},
            "Rio Tinto": {"cat": "원소재", "name": "리오틴토", "risk": "중간", "desc": "광물 자원 발굴 및 제련", "fin": "안정", "sales": "540억$", "type": "해외", "country": "호주/영국", "item": "알루미늄 합금 원광"},
        }

    def init_ui(self):
        self.setWindowTitle("AEROSPACE STRATEGIC PROCUREMENT CONTROL TOWER 2026")
        self.resize(1680, 980)

        self.setStyleSheet("""
            QMainWindow {
                background-color: #07111f;
            }
            QWidget {
                color: #d6deeb;
                font-family: "Malgun Gothic";
            }
            QFrame#metricCard, QGroupBox, QListWidget, QTextEdit, QTableWidget, QTabWidget::pane {
                background-color: #0d1728;
                border: 1px solid #1e3550;
                border-radius: 14px;
            }
            QLabel#heroTitle {
                font-size: 28px;
                font-weight: 800;
                color: #f2f7ff;
            }
            QLabel#heroSub {
                font-size: 12px;
                color: #7e92ac;
            }
            QLabel#metricTitle {
                color: #7fa5cc;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
            }
            QLabel#metricValue {
                color: #f4f8ff;
                font-size: 24px;
                font-weight: 800;
            }
            QLabel#metricSub {
                color: #7e92ac;
                font-size: 11px;
            }
            QGroupBox {
                font-size: 13px;
                font-weight: 700;
                margin-top: 14px;
                padding: 18px 14px 14px 14px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 12px;
                padding: 0 6px;
                color: #8bc6ff;
            }
            QLineEdit {
                background-color: #091423;
                border: 1px solid #284766;
                border-radius: 10px;
                padding: 12px 14px;
                color: #f1f5f9;
                font-size: 13px;
            }
            QPushButton {
                background-color: #1b6fff;
                color: white;
                border: none;
                border-radius: 10px;
                padding: 12px 18px;
                font-weight: 700;
            }
            QPushButton:hover {
                background-color: #3f87ff;
            }
            QPushButton:disabled {
                background-color: #35517d;
                color: #bdd0ef;
            }
            QListWidget {
                outline: none;
                padding: 6px;
            }
            QListWidget::item {
                padding: 10px;
                margin: 3px;
                border-radius: 8px;
            }
            QListWidget::item:selected {
                background-color: #18324e;
                color: #ffffff;
            }
            QTextEdit {
                padding: 14px;
                font-size: 13px;
                line-height: 1.6;
            }
            QHeaderView::section {
                background-color: #0f2138;
                color: #9fc7f0;
                padding: 8px;
                border: none;
                font-weight: 700;
            }
            QTableWidget {
                gridline-color: #1a3350;
                selection-background-color: #19324f;
                selection-color: #f4f8ff;
            }
            QTableWidget::item {
                padding: 6px;
            }
            QTabBar::tab {
                background-color: #0b1424;
                border: 1px solid #1d3350;
                color: #89a2bf;
                padding: 10px 16px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                margin-right: 4px;
            }
            QTabBar::tab:selected {
                background-color: #17304d;
                color: #ffffff;
            }
        """)

        central = QWidget()
        self.setCentralWidget(central)
        root = QVBoxLayout(central)
        root.setContentsMargins(20, 18, 20, 20)
        root.setSpacing(16)

        root.addLayout(self.build_header())
        root.addLayout(self.build_metric_cards())
        root.addWidget(self.build_main_splitter())

    def build_header(self):
        layout = QHBoxLayout()
        layout.setSpacing(16)

        title_box = QVBoxLayout()
        hero = QLabel("AEROSPACE PROCUREMENT COMMAND CENTER")
        hero.setObjectName("heroTitle")
        subtitle = QLabel("실시간 공급망 감시, 공급사 포트폴리오 평가, 자동 전략 인사이트")
        subtitle.setObjectName("heroSub")
        title_box.addWidget(hero)
        title_box.addWidget(subtitle)

        controls = QHBoxLayout()
        controls.setSpacing(10)

        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("업체명, 국가, 품목, 카테고리 검색")
        self.search_input.textChanged.connect(self.populate_lists)

        self.btn_refresh = QPushButton("실시간 데이터 갱신")
        self.btn_refresh.clicked.connect(self.refresh_all)

        controls.addWidget(self.search_input, 1)
        controls.addWidget(self.btn_refresh)

        layout.addLayout(title_box, 4)
        layout.addLayout(controls, 3)
        return layout

    def build_metric_cards(self):
        layout = QHBoxLayout()
        layout.setSpacing(12)

        self.card_usd = MetricCard("USD/KRW", "--", "원화 환율 모니터링")
        self.card_alu = MetricCard("ALUMINUM", "--", "LME 알루미늄 선물")
        self.card_bdry = MetricCard("LOGISTICS", "--", "건화물 해상 운임")
        self.card_rate = MetricCard("US 10Y", "--", "미국 장기금리")
        self.card_risk = MetricCard("RISK ALERT", "--", "공급망 위험도")

        for card in [self.card_usd, self.card_alu, self.card_bdry, self.card_rate, self.card_risk]:
            layout.addWidget(card)
        return layout

    def build_main_splitter(self):
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setChildrenCollapsible(False)

        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(0, 0, 0, 0)
        left_layout.setSpacing(14)

        supplier_tabs = QGroupBox("Supplier Universe")
        supplier_layout = QVBoxLayout(supplier_tabs)
        self.tab_widget = QTabWidget()
        self.list_domestic = QListWidget()
        self.list_global = QListWidget()
        self.list_domestic.itemClicked.connect(self.update_detail)
        self.list_global.itemClicked.connect(self.update_detail)
        self.tab_widget.addTab(self.list_domestic, "국내 공급사")
        self.tab_widget.addTab(self.list_global, "해외 공급사")
        supplier_layout.addWidget(self.tab_widget)

        self.summary_table = QTableWidget(0, 5)
        self.summary_table.setHorizontalHeaderLabels(["업체", "국가", "품목", "리스크", "조달 우선순위"])
        self.summary_table.verticalHeader().setVisible(False)
        self.summary_table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.summary_table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.summary_table.horizontalHeader().setStretchLastSection(True)

        table_group = QGroupBox("Priority Sourcing Matrix")
        table_layout = QVBoxLayout(table_group)
        table_layout.addWidget(self.summary_table)

        left_layout.addWidget(supplier_tabs, 3)
        left_layout.addWidget(table_group, 2)

        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(0, 0, 0, 0)
        right_layout.setSpacing(14)

        self.ops_board = QTextEdit()
        self.ops_board.setReadOnly(True)
        ops_group = QGroupBox("Executive Procurement Brief")
        ops_layout = QVBoxLayout(ops_group)
        ops_layout.addWidget(self.ops_board)

        self.news_view = QListWidget()
        self.news_view.itemDoubleClicked.connect(self.open_link)
        news_group = QGroupBox("Live Market / News Feed")
        news_layout = QVBoxLayout(news_group)
        news_layout.addWidget(self.news_view)

        self.detail_view = QTextEdit()
        self.detail_view.setReadOnly(True)
        detail_group = QGroupBox("Supplier Intelligence Dossier")
        detail_layout = QVBoxLayout(detail_group)
        detail_layout.addWidget(self.detail_view)

        right_layout.addWidget(ops_group, 2)
        right_layout.addWidget(news_group, 2)
        right_layout.addWidget(detail_group, 3)

        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setSizes([620, 980])

        return splitter

    def populate_lists(self):
        filter_text = self.search_input.text().strip().lower()
        self.list_domestic.clear()
        self.list_global.clear()

        filtered_items = []
        for key in sorted(self.company_db.keys()):
            info = self.company_db[key]
            searchable = " ".join([key, info["cat"], info["item"], info["name"], info["country"]]).lower()
            if filter_text and filter_text not in searchable:
                continue

            list_item = QListWidgetItem(f"[{info['cat']}] {key}")
            if self.normalize_risk(info["risk"]) >= 2:
                list_item.setForeground(QColor("#ff8b8b"))
            elif self.normalize_risk(info["risk"]) == 1:
                list_item.setForeground(QColor("#ffd166"))
            else:
                list_item.setForeground(QColor("#8ce99a"))

            filtered_items.append((key, info))
            if info["type"] == "국내":
                self.list_domestic.addItem(list_item)
            else:
                self.list_global.addItem(list_item)

        self.populate_summary_table(filtered_items)
        self.render_executive_report(filtered_items)

    def populate_summary_table(self, items):
        ranked = sorted(items, key=lambda x: self.procurement_priority_score(x[0], x[1]), reverse=True)[:12]
        self.summary_table.setRowCount(len(ranked))

        for row, (key, info) in enumerate(ranked):
            values = [
                info["name"],
                info["country"],
                info["item"],
                info["risk"],
                self.priority_label(self.procurement_priority_score(key, info)),
            ]
            for col, value in enumerate(values):
                cell = QTableWidgetItem(str(value))
                if col == 3:
                    risk_score = self.normalize_risk(info["risk"])
                    if risk_score >= 2:
                        cell.setForeground(QColor("#ff8b8b"))
                    elif risk_score == 1:
                        cell.setForeground(QColor("#ffd166"))
                    else:
                        cell.setForeground(QColor("#8ce99a"))
                self.summary_table.setItem(row, col, cell)

        self.summary_table.resizeColumnsToContents()

    def priority_label(self, score):
        if score >= 86:
            return "Tier 1 / 즉시 관리"
        if score >= 72:
            return "Tier 2 / 전략 모니터링"
        return "Tier 3 / 일반 감시"

    def procurement_priority_score(self, key, info):
        base = 100
        risk_penalty = self.normalize_risk(info["risk"]) * 10
        fin_penalty = {"강력": 0, "안정": 4, "보통": 8, "주의": 12, "변동": 14}.get(info["fin"], 10)
        strategic_bonus = 10 if any(token in info["cat"] for token in ["완제기", "엔진", "유도무기", "우주항공", "원소재"]) else 3
        local_bonus = 5 if info["type"] == "국내" else 0
        hidden_penalty = 5 if "미공개" in info["sales"] or "비공개" in info["sales"] else 0
        name_bonus = 5 if key in ["KAI", "Hanwha Aero", "LIG Nex1", "Boeing", "Airbus", "Lockheed Martin"] else 0
        return max(45, base - risk_penalty - fin_penalty - hidden_penalty + strategic_bonus + local_bonus + name_bonus)

    def normalize_risk(self, risk_text):
        mapping = {"낮음": 0, "중간": 1, "보통": 1, "주의": 2, "높음": 3}
        return mapping.get(risk_text, 1)

    def update_detail(self, item):
        try:
            key = item.text().split("] ", 1)[1].strip()
            info = self.company_db[key]
            score = self.procurement_priority_score(key, info)

            text = f"""
            <div style="font-size:16px; color:#f4f8ff; font-weight:800;">{info['name']} / {key}</div>
            <div style="margin-top:8px; color:#89a2bf;">{info['country']} | {info['type']} 공급망 | {info['cat']}</div>
            <hr style="border:0; border-top:1px solid #24405f; margin:14px 0;">
            <div><b>핵심 공급 품목</b> : <span style="color:#7fd8ff;">{info['item']}</span></div>
            <div><b>연 매출 / 재무 안정성</b> : {info['sales']} / {info['fin']}</div>
            <div><b>공급망 리스크</b> : <span style="color:{self.risk_color(info['risk'])};">{info['risk']}</span></div>
            <div><b>조달 우선순위 점수</b> : <span style="color:#ffd166;">{score:.0f}점</span></div>
            <br>
            <div style="color:#d8e3f0;"><b>사업 요약</b><br>{info['desc']}</div>
            <br>
            <div style="color:#d8e3f0;"><b>권고 액션</b><br>{self.make_company_action_plan(key, info, score)}</div>
            """
            self.detail_view.setHtml(text)
            self.fetch_news(info["name"])
        except Exception:
            QMessageBox.warning(self, "오류", "업체 상세 정보를 불러오지 못했습니다.")

    def make_company_action_plan(self, key, info, score):
        actions = []
        if self.normalize_risk(info["risk"]) >= 2:
            actions.append("대체 공급사 소싱 및 안전재고 재점검 필요")
        if info["type"] == "해외":
            actions.append("환율 및 물류비 헤지 시나리오 병행 검토")
        if "원소재" in info["cat"] or "엔진" in info["cat"]:
            actions.append("장기 단가 계약 및 분기별 원자재 연동 조항 협상 권고")
        if "우주" in info["cat"] or "완제기" in info["cat"]:
            actions.append("경영진 보고용 전략 공급사로 분류")
        if score >= 86:
            actions.append("CEO 주간 보고 대상에 편입")
        if not actions:
            actions.append("현행 거래 조건 유지, 반기별 평가 권장")
        return " / ".join(actions)

    def render_executive_report(self, filtered_items):
        all_items = filtered_items if filtered_items else list(self.company_db.items())
        domestic = [info for _, info in all_items if info["type"] == "국내"]
        overseas = [info for _, info in all_items if info["type"] == "해외"]
        high_risk = [info for _, info in all_items if self.normalize_risk(info["risk"]) >= 2]
        strategic = [info for _, info in all_items if any(token in info["cat"] for token in ["완제기", "엔진", "원소재", "유도무기", "우주항공"])]

        avg_priority = mean(self.procurement_priority_score(k, v) for k, v in all_items) if all_items else 0
        risk_level = "안정"
        if len(high_risk) >= 5:
            risk_level = "경계"
        elif len(high_risk) >= 2:
            risk_level = "주의"

        self.card_risk.update_value(
            risk_level,
            f"고위험 {len(high_risk)}개사 / 평균 우선순위 {avg_priority:.1f}"
        )

        report = f"""
        <div style="font-size:16px; font-weight:800; color:#f8fbff;">Executive Summary</div>
        <div style="margin-top:8px; color:#9db7d3;">
        현재 검색 조건 기준 공급사 {len(all_items)}개사를 분석했습니다. 국내 {len(domestic)}개사, 해외 {len(overseas)}개사로 구성되어 있으며,
        전략 품목 연관 공급사는 {len(strategic)}개사입니다.
        </div>
        <br>
        <div style="color:#d7e3ef;"><b>1. 경영진 관점 핵심 포인트</b><br>
        공급망 리스크가 높은 업체는 {len(high_risk)}개사이며, 특히 해외 원소재 또는 엔진 계열은 환율과 운임지수 영향도가 큽니다.
        </div>
        <br>
        <div style="color:#d7e3ef;"><b>2. 추천 액션</b><br>
        고위험 업체는 이원화 소싱 검토, 해외 공급사는 환헤지 검토, 전략 품목 공급사는 분기 단위 구매계약 재협상 권고.
        </div>
        <br>
        <div style="color:#d7e3ef;"><b>3. AI 의견</b><br>
        현 대시보드는 단순 조회를 넘어서 '우선 관리 대상'을 바로 식별하는 방향으로 구성되었습니다. 추후 납기, 품질 클레임,
        월별 발주금액 컬럼이 추가되면 실제 구매본부용 의사결정 툴 수준으로 확장 가능합니다.
        </div>
        """
        self.ops_board.setHtml(report)

    def risk_color(self, risk_text):
        return {
            "낮음": "#8ce99a",
            "보통": "#ffd166",
            "중간": "#ffd166",
            "주의": "#ff9f43",
            "높음": "#ff6b6b",
        }.get(risk_text, "#d6deeb")

    def refresh_all(self):
        self.btn_refresh.setEnabled(False)
        self.btn_refresh.setText("데이터 갱신 중...")
        threading.Thread(target=self.get_market_intelligence, daemon=True).start()
        self.fetch_news("항공 우주 산업 공급망")
        QTimer.singleShot(1800, self.finish_refresh)

    def finish_refresh(self):
        self.btn_refresh.setEnabled(True)
        self.btn_refresh.setText("실시간 데이터 갱신")

    def get_market_intelligence(self):
        results = {}
        tickers = [("USD", "USDKRW=X"), ("ALU", "ALI=F"), ("BDRY", "BDRY"), ("RATE", "^TNX")]
        for key, ticker in tickers:
            try:
                data = yf.Ticker(ticker).history(period="5d")
                if not data.empty:
                    close = float(data["Close"].iloc[-1])
                    prev = float(data["Close"].iloc[-2]) if len(data) > 1 else close
                    change = close - prev
                    results[key] = {"value": close, "change": change}
                else:
                    results[key] = {"value": None, "change": None}
            except Exception:
                results[key] = {"value": None, "change": None}

        self.market_received.emit(results)

    def display_market(self, data):
        self.market_snapshot = data
        self.card_usd.update_value(self.metric_text(data.get("USD"), "원"), self.metric_change(data.get("USD")))
        self.card_alu.update_value(self.metric_text(data.get("ALU"), "$"), self.metric_change(data.get("ALU")))
        self.card_bdry.update_value(self.metric_text(data.get("BDRY"), ""), self.metric_change(data.get("BDRY")))
        self.card_rate.update_value(self.metric_text(data.get("RATE"), "%"), self.metric_change(data.get("RATE")))

    def metric_text(self, payload, suffix):
        if not payload or payload["value"] is None:
            return "N/A"
        return f"{payload['value']:.2f}{suffix}"

    def metric_change(self, payload):
        if not payload or payload["change"] is None:
            return "전일 대비 정보 없음"
        delta = payload["change"]
        direction = "상승" if delta > 0 else "하락" if delta < 0 else "보합"
        sign = "+" if delta > 0 else ""
        return f"전일 대비 {direction} {sign}{delta:.2f}"

    def fetch_news(self, query):
        def worker():
            try:
                ssl._create_default_https_context = ssl._create_unverified_context
                safe_query = urllib.parse.quote(f"{query} aerospace OR defense")
                url = f"https://news.google.com/rss/search?q={safe_query}&hl=ko&gl=KR&ceid=KR:ko"
                feed = feedparser.parse(url)
                entries = feed.entries[:15]
                titles = [f"• {entry.title}" for entry in entries]
                links = [entry.link for entry in entries]
                if not titles:
                    titles = ["• 관련 기사가 아직 수집되지 않았습니다."]
                self.news_received.emit(titles, links)
            except Exception:
                self.news_received.emit(["• 네트워크 연결 확인이 필요합니다."], [])

        threading.Thread(target=worker, daemon=True).start()

    def display_news(self, titles, links):
        self.news_view.clear()
        self.news_links = links
        for title in titles:
            self.news_view.addItem(title)

    def open_link(self, item):
        idx = self.news_view.row(item)
        if 0 <= idx < len(self.news_links):
            webbrowser.open(self.news_links[idx])


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = GlobalAerospaceControl()
    window.show()
    sys.exit(app.exec())
