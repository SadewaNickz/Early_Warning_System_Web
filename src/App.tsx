import { useState, useEffect, useRef } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Droplets,
  LayoutGrid,
  MapPin,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Video,
  Waves,
  Wifi,
  X,
  Check,
  Clock3,
  Search,
  Menu,
  Maximize2,
  SlidersHorizontal,
  LogOut,
  Lock,
  User,
  Eye,
  EyeOff,
  Calendar,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Filter,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface UserProfile {
  name: string;
  role: string;
  agency: string;
  initials: string;
  id: string;
}

const userPresets: Record<string, UserProfile> = {
  operator: {
    id: 'DPU-OP-01',
    name: 'Alvin / Operator DPU',
    role: 'Operator Command Room',
    agency: 'Dinas Pekerjaan Umum Kota Semarang',
    initials: 'AP',
  },
  pompa: {
    id: 'UPTD-RP-04',
    name: 'Pak Tedi / Petugas Pompa',
    role: 'Operator Rumah Pompa',
    agency: 'UPTD Drainase & Rumah Pompa Semarang',
    initials: 'PT',
  },
  pejabat: {
    id: 'DPU-STR-02',
    name: 'Pak Taufiq / Pak Fahmi',
    role: 'Kepala UPTD / Pejabat Struktural',
    agency: 'Dinas Pekerjaan Umum Kota Semarang',
    initials: 'TF',
  },
};

const baseStations = [
  { name: 'Sungai Banjir Kanal Barat', area: 'Jembatan Lemah Gempal', height: 2.35, rain: 12, limit: 4.5, status: 'Aman', online: true },
  { name: 'Sungai Banjir Kanal Timur', area: 'Jembatan Citarum', height: 3.82, rain: 28, limit: 4.5, status: 'Mendekati batas', online: true },
  { name: 'Sungai Garang', area: 'Jembatan Tinjomoyo', height: 1.85, rain: 8, limit: 4, status: 'Aman', online: true },
  { name: 'Sungai Kreo', area: 'Jembatan Kalipancur', height: 1.42, rain: 5, limit: 3.5, status: 'Aman', online: true },
  { name: 'Sungai Tenggang', area: 'Jembatan Kaligawe', height: 2.68, rain: 18, limit: 3.5, status: 'Aman', online: true },
  { name: 'Sungai Babon', area: 'Jembatan Penggaron', height: 1.76, rain: 0, limit: 4, status: 'Data terputus', online: false },
];

const nav = [
  { label: 'Ringkasan', icon: LayoutGrid },
  { label: 'Lokasi pemantauan', icon: MapPin },
  { label: 'CCTV sungai', icon: Video },
  { label: 'Riwayat & laporan', icon: Clock3 },
  { label: 'Perangkat & jaringan', icon: Radio },
];

const series = [1.65, 1.72, 1.68, 1.78, 1.82, 1.76, 1.93, 2.08, 2.03, 2.17, 2.12, 2.23, 2.29, 2.22, 2.35];

const baseHistoricalLogs = [
  {
    id: 'LOG-8891',
    time: '05 Okt 2026, 10:00 WIB',
    stationIndex: 1,
    stationName: 'Sungai Banjir Kanal Timur',
    area: 'Jembatan Citarum',
    height: 3.82,
    delta: '+0,12 m',
    deltaType: 'up',
    rainHour: 14.2,
    rainTotal: 28.0,
    limit: 4.5,
    status: 'Mendekati batas',
    action: 'Notifikasi Alarm Siaga Dikirim • Pemantauan Diintensifkan',
  },
  {
    id: 'LOG-8890',
    time: '05 Okt 2026, 09:00 WIB',
    stationIndex: 1,
    stationName: 'Sungai Banjir Kanal Timur',
    area: 'Jembatan Citarum',
    height: 3.70,
    delta: '+0,15 m',
    deltaType: 'up',
    rainHour: 18.0,
    rainTotal: 25.0,
    limit: 4.5,
    status: 'Mendekati batas',
    action: 'Pintu Air DPU Siaga • Petugas Standby',
  },
  {
    id: 'LOG-8889',
    time: '05 Okt 2026, 08:30 WIB',
    stationIndex: 0,
    stationName: 'Sungai Banjir Kanal Barat',
    area: 'Jembatan Lemah Gempal',
    height: 2.35,
    delta: '+0,05 m',
    deltaType: 'up',
    rainHour: 6.0,
    rainTotal: 12.0,
    limit: 4.5,
    status: 'Aman',
    action: 'Normal • Aliran Terkendali',
  },
  {
    id: 'LOG-8888',
    time: '05 Okt 2026, 08:00 WIB',
    stationIndex: 4,
    stationName: 'Sungai Tenggang',
    area: 'Jembatan Kaligawe',
    height: 2.68,
    delta: '+0,10 m',
    deltaType: 'up',
    rainHour: 8.5,
    rainTotal: 18.0,
    limit: 3.5,
    status: 'Aman',
    action: 'Pompa Drainase Rumah Pompa Standby',
  },
  {
    id: 'LOG-8887',
    time: '05 Okt 2026, 07:00 WIB',
    stationIndex: 2,
    stationName: 'Sungai Garang',
    area: 'Jembatan Tinjomoyo',
    height: 1.85,
    delta: '+0,02 m',
    deltaType: 'up',
    rainHour: 4.0,
    rainTotal: 8.0,
    limit: 4.0,
    status: 'Aman',
    action: 'Normal • Pengukuran Rutin',
  },
  {
    id: 'LOG-8886',
    time: '05 Okt 2026, 06:00 WIB',
    stationIndex: 3,
    stationName: 'Sungai Kreo',
    area: 'Jembatan Kalipancur',
    height: 1.42,
    delta: '-0,03 m',
    deltaType: 'down',
    rainHour: 2.0,
    rainTotal: 5.0,
    limit: 3.5,
    status: 'Aman',
    action: 'Normal • Muka Air Surut',
  },
  {
    id: 'LOG-8885',
    time: '05 Okt 2026, 05:00 WIB',
    stationIndex: 5,
    stationName: 'Sungai Babon',
    area: 'Jembatan Penggaron',
    height: 1.76,
    delta: '0,00 m',
    deltaType: 'steady',
    rainHour: 0.0,
    rainTotal: 0.0,
    limit: 4.0,
    status: 'Data terputus',
    action: 'Periksa Gateway Lapangan • Sinyal Hilang',
  },
  {
    id: 'LOG-8884',
    time: '05 Okt 2026, 04:00 WIB',
    stationIndex: 1,
    stationName: 'Sungai Banjir Kanal Timur',
    area: 'Jembatan Citarum',
    height: 3.55,
    delta: '+0,20 m',
    deltaType: 'up',
    rainHour: 22.5,
    rainTotal: 20.0,
    limit: 4.5,
    status: 'Aman',
    action: 'Hujan Intensitas Lebat Terdeteksi',
  },
  {
    id: 'LOG-8883',
    time: '05 Okt 2026, 03:00 WIB',
    stationIndex: 0,
    stationName: 'Sungai Banjir Kanal Barat',
    area: 'Jembatan Lemah Gempal',
    height: 2.30,
    delta: '+0,08 m',
    deltaType: 'up',
    rainHour: 5.0,
    rainTotal: 10.0,
    limit: 4.5,
    status: 'Aman',
    action: 'Normal • Pemantauan Radar',
  },
  {
    id: 'LOG-8882',
    time: '05 Okt 2026, 02:00 WIB',
    stationIndex: 4,
    stationName: 'Sungai Tenggang',
    area: 'Jembatan Kaligawe',
    height: 2.58,
    delta: '+0,05 m',
    deltaType: 'up',
    rainHour: 6.0,
    rainTotal: 15.0,
    limit: 3.5,
    status: 'Aman',
    action: 'Normal • Pintu Air Siaga',
  },
  {
    id: 'LOG-8881',
    time: '04 Okt 2026, 23:00 WIB',
    stationIndex: 1,
    stationName: 'Sungai Banjir Kanal Timur',
    area: 'Jembatan Citarum',
    height: 3.35,
    delta: '+0,10 m',
    deltaType: 'up',
    rainHour: 10.0,
    rainTotal: 12.0,
    limit: 4.5,
    status: 'Aman',
    action: 'Normal • Hujan Sedang',
  },
  {
    id: 'LOG-8880',
    time: '04 Okt 2026, 20:00 WIB',
    stationIndex: 2,
    stationName: 'Sungai Garang',
    area: 'Jembatan Tinjomoyo',
    height: 1.83,
    delta: '-0,05 m',
    deltaType: 'down',
    rainHour: 1.0,
    rainTotal: 7.0,
    limit: 4.0,
    status: 'Aman',
    action: 'Normal • Air Terpantau Stabil',
  },
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(userPresets.operator);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Application State
  const [page, setPage] = useState('Ringkasan');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const [range, setRange] = useState('24 jam');
  const [filter, setFilter] = useState('Semua status');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [limit, setLimit] = useState(4.5);
  const [limits, setLimits] = useState<Record<number, number>>({});

  // Riwayat & Laporan State
  const [reportStation, setReportStation] = useState<string>('all');
  const [reportPeriod, setReportPeriod] = useState<string>('24 jam');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('Semua status');
  const [reportSearch, setReportSearch] = useState<string>('');
  const mainShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainShellRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  const stations = baseStations.map((item, index) => {
    const boundary = limits[index] ?? item.limit;
    const status = !item.online
      ? 'Data terputus'
      : item.height > boundary
      ? 'Bahaya'
      : item.height >= boundary * 0.8
      ? 'Mendekati batas'
      : 'Aman';
    return { ...item, limit: boundary, status };
  });

  const dangerCount = stations.filter((item) => item.status === 'Bahaya').length;
  const warningCount = stations.filter((item) => item.status === 'Mendekati batas').length;
  const alerts = stations
    .filter((item) => item.status === 'Bahaya' || item.status === 'Mendekati batas')
    .sort((first, second) => Number(second.status === 'Bahaya') - Number(first.status === 'Bahaya'));
  const alertStation = alerts[0];

  const statusColor = (status: string) =>
    status === 'Bahaya' ? 'danger' : status === 'Mendekati batas' ? 'amber' : status === 'Aman' ? 'green' : 'gray';

  const station = stations[selected];
  const threshold = limits[selected] ?? station.limit;

  const data = series.map((value, index) => ({
    time: `${String(range === '6 jam' ? 4 + index / 3 : index * 1.6).split('.')[0].padStart(2, '0')}:00`,
    water: +(value + station.height - 2.35).toFixed(2),
  }));

  const shown = stations.filter(
    (item) =>
      (filter === 'Semua status' || item.status === filter) &&
      `${item.name} ${item.area}`.toLowerCase().includes(search.toLowerCase())
  );

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }
    // Demo: accept any non-empty credentials
    const preset = userPresets.operator;
    const updatedUser: UserProfile = {
      ...preset,
      name: loginUsername.trim(),
    };
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setNotice(`Selamat datang, ${updatedUser.name}.`);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setModal('');
    setMobileMenu(false);
    setNotice('Anda telah berhasil keluar dari sistem.');
  }

  function exportData() {
    const content =
      'Lokasi,Tinggi muka air (m),Curah hujan (mm),Status\n' +
      stations.map((item) => `${item.name},${item.height},${item.rain},${item.status}`).join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'laporan-ews.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Laporan berhasil diunduh.');
  }

  // Perhitungan Data Riwayat & Laporan
  const filteredReportLogs = baseHistoricalLogs.filter((item) => {
    const matchStation = reportStation === 'all' || item.stationIndex === Number(reportStation);
    const matchStatus = reportStatusFilter === 'Semua status' || item.status === reportStatusFilter;
    const matchSearch =
      item.stationName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.area.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.action.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.time.toLowerCase().includes(reportSearch.toLowerCase());
    return matchStation && matchStatus && matchSearch;
  });

  const activeReportStation = reportStation === 'all' ? stations[1] : stations[Number(reportStation)];
  const activeReportLimit = limits[reportStation === 'all' ? 1 : Number(reportStation)] ?? activeReportStation.limit;

  const reportChartData = [
    { time: '00:00', water: +(activeReportStation.height - 0.85).toFixed(2), rain: 1.5, threshold: activeReportLimit },
    { time: '02:00', water: +(activeReportStation.height - 0.70).toFixed(2), rain: 4.0, threshold: activeReportLimit },
    { time: '04:00', water: +(activeReportStation.height - 0.27).toFixed(2), rain: 22.5, threshold: activeReportLimit },
    { time: '06:00', water: +(activeReportStation.height - 0.17).toFixed(2), rain: 16.0, threshold: activeReportLimit },
    { time: '08:00', water: +(activeReportStation.height - 0.12).toFixed(2), rain: 18.0, threshold: activeReportLimit },
    { time: '10:00', water: +(activeReportStation.height).toFixed(2), rain: activeReportStation.rain > 10 ? 14.2 : 4.5, threshold: activeReportLimit },
    { time: '12:00', water: +(activeReportStation.height - 0.08).toFixed(2), rain: 8.0, threshold: activeReportLimit },
    { time: '14:00', water: +(activeReportStation.height - 0.22).toFixed(2), rain: 3.5, threshold: activeReportLimit },
    { time: '16:00', water: +(activeReportStation.height - 0.35).toFixed(2), rain: 1.0, threshold: activeReportLimit },
    { time: '18:00', water: +(activeReportStation.height - 0.45).toFixed(2), rain: 0.5, threshold: activeReportLimit },
    { time: '20:00', water: +(activeReportStation.height - 0.55).toFixed(2), rain: 0.0, threshold: activeReportLimit },
    { time: '22:00', water: +(activeReportStation.height - 0.60).toFixed(2), rain: 0.0, threshold: activeReportLimit },
  ];

  const reportMaxWater = Math.max(...reportChartData.map((d) => d.water));
  const reportMaxRain = Math.max(...reportChartData.map((d) => d.rain));
  const reportTotalRain = reportChartData.reduce((acc, curr) => acc + curr.rain, 0).toFixed(1);
  const reportAlertEvents = filteredReportLogs.filter((l) => l.status === 'Bahaya' || l.status === 'Mendekati batas').length;

  function exportReportCSV() {
    const header = 'ID Log,Waktu,Lokasi Sungai,Titik Pantau,Tinggi Muka Air (m),Batas Talut (m),Curah Hujan Jam-an (mm/jam),Akumulasi Harian (mm/hari),Status,Tindakan / Catatan\\n';
    const rows = filteredReportLogs.map((item) =>
      `"${item.id}","${item.time}","${item.stationName}","${item.area}",${item.height.toFixed(2)},${item.limit.toFixed(2)},${item.rainHour.toFixed(1)},${item.rainTotal.toFixed(1)},"${item.status}","${item.action}"`
    ).join('\\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-EWS-Semarang-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Laporan riwayat berkala berhasil diunduh (CSV).');
  }

  function printReport() {
    window.print();
  }

  // JIKA BELUM LOGIN
  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="brand-icon">
                <Waves size={22} />
              </span>
              <h1>EWS</h1>
            </div>
            <p className="login-subtitle">Masuk ke Sistem Pemantauan Dini Sungai</p>
          </div>

          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="login-field">
              <label htmlFor="login-user">Nama pengguna</label>
              <div className="login-input-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="login-user"
                  type="text"
                  placeholder="NIP atau ID petugas"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => { setLoginUsername(e.target.value); setLoginError(''); }}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-pass">Kata sandi</label>
              <div className="login-input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && <p className="login-error">{loginError}</p>}

            <button type="submit" className="login-btn-submit">Masuk</button>
          </form>

          <div className="login-footer-meta">
            <span>Dinas Pekerjaan Umum Kota Semarang</span>
            <small>v1.0</small>
          </div>
        </div>

        {notice && (
          <div className="toast" role="status">
            <Check size={17} />
            {notice}
            <button aria-label="Tutup" onClick={() => setNotice('')}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // JIKA SUDAH LOGIN: TAMPILKAN DASHBOARD/Pusat Pemantauan EWS
  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-scrim"
          aria-label="Tutup menu navigasi"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
        <button
          className="mobile-menu-close"
          aria-label="Tutup menu"
          onClick={() => setMobileMenu(false)}
        >
          <X size={22} />
        </button>

        <a className="brand" href="#" onClick={() => setPage('Ringkasan')}>
          <span className="brand-icon">
            <Waves size={24} />
          </span>
          <span>
            EWS<span className="brand-sub">KOTA SEMARANG</span>
          </span>
        </a>

        <div className="workspace">
          <span className="workspace-icon">
            <ShieldCheck size={19} />
          </span>
          <div>
            <b>Pusat pemantauan</b>
            <span>{currentUser.agency}</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <span className="nav-caption">PEMANTAUAN</span>
        <nav>
          {nav.map((item) => (
            <button
              className={page === item.label ? 'nav-item active' : 'nav-item'}
              key={item.label}
              onClick={() => {
                setPage(item.label);
                setMobileMenu(false);
              }}
            >
              <item.icon size={19} />
              {item.label}
              {item.label === 'Lokasi pemantauan' && <span className="nav-count">6</span>}
            </button>
          ))}
          <button className="nav-item" onClick={() => setModal('Peringatan')}>
            <Bell size={19} />
            Peringatan
            <span className="alert-count">{alerts.length}</span>
          </button>
        </nav>

        <span className="nav-caption management">PENGELOLAAN</span>
        <button
          className="nav-item"
          onClick={() => {
            setLimit(threshold);
            setModal('Pengaturan ambang batas');
          }}
        >
          <Settings2 size={19} />
          Pengaturan sistem
        </button>

        <div className="sidebar-bottom">
          <div className="help-box">
            <span className="help-icon">
              <CircleHelp size={20} />
            </span>
            <b>Butuh bantuan?</b>
            <p>Panduan pemantauan sistem EWS.</p>
            <button onClick={() => setModal('Panduan pemantauan')}>
              Buka panduan <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="profile">
            <span className="avatar">{currentUser.initials}</span>
            <div>
              <b>{currentUser.name}</b>
              <span>{currentUser.role}</span>
            </div>
            <button aria-label="Keluar dari akun" onClick={handleLogout} title="Keluar / Logout">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="main-shell" ref={mainShellRef}>
        <header className="topbar">
          <div>
            <button
              className="mobile-menu-trigger"
              aria-label="Buka navigasi"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>
            <span className="desktop-breadcrumb">Pemantauan</span>
            <ChevronRight size={14} />
            <b>{page}</b>
          </div>
          <div>
            <span className="system-live">
              <i />
              Sistem aktif
            </span>
            <span className="top-divider" />
            <button
              className="bell-button"
              aria-label="Lihat peringatan"
              onClick={() => setModal('Peringatan')}
            >
              <Bell size={19} />
              <i />
            </button>
            <button aria-label="Informasi akun" onClick={() => setModal('Akun operator')}>
              <span className="avatar small">{currentUser.initials}</span>
            </button>
          </div>
        </header>

        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">EARLY WARNING SYSTEM</div>
              <h1>{page === 'Ringkasan' ? 'Ringkasan pemantauan' : page === 'Riwayat & laporan' ? 'Riwayat & laporan berkala' : page}</h1>
              <p>
                {page === 'Riwayat & laporan'
                  ? 'Arsip pencatatan sensor muka air, telemetri curah hujan tipping bucket, dan rekam jejak peringatan dini.'
                  : page === 'CCTV sungai'
                  ? 'Pemantauan visual langsung dari seluruh titik CCTV sungai di Kota Semarang.'
                  : page === 'Perangkat & jaringan'
                  ? 'Status konektivitas sensor IoT, gateway telemetri, dan infrastruktur transmisi data.'
                  : page === 'Lokasi pemantauan'
                  ? 'Daftar lengkap dan kondisi seluruh pos pemantauan air dan curah hujan.'
                  : 'Pantau kondisi sungai dan kesiapan sistem dalam satu tampilan.'}
              </p>
            </div>
            {page === 'Riwayat & laporan' ? (
              <div className="heading-actions">
                <button className="button" onClick={exportReportCSV} title="Unduh CSV data historis">
                  <FileSpreadsheet size={16} />
                  Ekspor CSV
                </button>
                <button className="button print-btn" onClick={printReport} title="Cetak laporan">
                  <Printer size={16} />
                  Cetak
                </button>
              </div>
            ) : (
              <button className="button" onClick={exportData}>
                <ArrowDownToLine size={16} />
                Unduh laporan
              </button>
            )}
          </div>

          <div className="date-row">
            <span>
              <i className="live-dot" />
              Pembaruan terakhir <b>5 Oktober 2026, 10:24:38 WIB</b>
              <span className="demo-label">Data simulasi</span>
            </span>
            <button onClick={() => setNotice('Data simulasi telah diperbarui.')}>
              <RefreshCw size={13} />
              Segarkan
            </button>
          </div>

          {page !== 'Riwayat & laporan' && alertStation && (
            <div className={`warning-banner ${dangerCount ? 'danger-banner' : ''}`}>
              <span className="warning-symbol">!</span>
              <div>
                <b>
                  {dangerCount
                    ? `Bahaya: ${dangerCount} lokasi melebihi batas talut`
                    : `${warningCount} lokasi mendekati batas limpasan`}
                </b>
                <p>
                  {alertStation.name} berada pada ketinggian {alertStation.height.toFixed(2)} m, dengan
                  batas talut {alertStation.limit.toFixed(2)} m.{' '}
                  {dangerCount
                    ? 'Segera lakukan tindak lanjut sesuai prosedur tanggap darurat.'
                    : 'Tingkatkan pemantauan di lokasi ini.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelected(stations.indexOf(alertStation));
                  setModal('Detail lokasi');
                }}
              >
                Lihat lokasi <ArrowRight size={16} />
              </button>
            </div>
          )}

          {page !== 'Riwayat & laporan' && (
            <section className="stats-grid">
              {[
                {
                  label: 'Lokasi pemantauan',
                  icon: MapPin,
                  value: '6',
                  unit: 'lokasi',
                  note: 'Tersebar di Kota Semarang',
                  color: 'neutral',
                },
                {
                  label: 'Kondisi aman',
                  icon: ShieldCheck,
                  value: String(stations.filter((item) => item.status === 'Aman').length),
                  unit: 'lokasi',
                  note: 'Muka air di bawah batas',
                  color: 'green',
                },
                {
                  label: dangerCount ? 'Kondisi bahaya' : 'Mendekati batas',
                  icon: Waves,
                  value: String(dangerCount || warningCount),
                  unit: 'lokasi',
                  note: dangerCount ? 'Muka air melebihi batas talut' : 'Memerlukan perhatian',
                  color: dangerCount ? 'danger' : 'amber',
                },
                {
                  label: 'Perangkat online',
                  icon: Wifi,
                  value: '23',
                  unit: '/ 24 perangkat',
                  note: '1 perangkat tidak terhubung',
                  color: 'neutral',
                },
              ].map((item) => (
                <article className={`stat-card ${item.color}`} key={item.label}>
                  <div className="stat-label">
                    {item.label}
                    <item.icon size={19} />
                  </div>
                  <div className="stat-number">
                    {item.value}
                    <span>{item.unit}</span>
                  </div>
                  <div className="stat-note">
                    {item.color !== 'neutral' && <i />}
                    {item.note}
                    {item.label === 'Perangkat online' && <span className="uptime">95,8%</span>}
                  </div>
                </article>
              ))}
            </section>
          )}

          {page === 'Ringkasan' && (
            <section className="monitor-grid">
              <article className="panel chart-panel">
                <div className="panel-title">
                  <div>
                    <h2>Tinggi muka air</h2>
                    <p>Perubahan muka air terhadap batas talut</p>
                  </div>
                  <div className="segmented">
                    {['6 jam', '24 jam', '7 hari'].map((item) => (
                      <button
                        className={range === item ? 'selected' : ''}
                        onClick={() => setRange(item)}
                        key={item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chart-toolbar">
                  <select
                    aria-label="Lokasi grafik"
                    value={selected}
                    onChange={(event) => setSelected(Number(event.target.value))}
                  >
                    {stations.map((item, index) => (
                      <option value={index} key={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <span className={`badge ${statusColor(station.status)}`}>
                    <i />
                    {station.status}
                  </span>
                </div>

                <div className="water-value">
                  {station.height.toFixed(2).replace('.', ',')}
                  <span>m</span>
                  <span className="change">
                    <ArrowUpRight size={14} />
                    0,12 m <small>dari 1 jam lalu</small>
                  </span>
                </div>

                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 12, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#13987a" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#13987a" stopOpacity={0.015} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#e7ece9" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        interval={2}
                        tick={{ fontSize: 10, fill: '#819087' }}
                        dy={8}
                      />
                      <YAxis
                        domain={[0, 6]}
                        ticks={[0, 1.5, 3, 4.5, 6]}
                        tickFormatter={(value) => `${value.toFixed(1)}`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#819087' }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} m`, 'Muka air']}
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      />
                      <ReferenceLine
                        y={threshold}
                        stroke="#d89b35"
                        strokeDasharray="5 5"
                        label={{
                          value: `Batas talut ${threshold.toFixed(1)} m`,
                          position: 'insideTopRight',
                          fill: '#a97724',
                          fontSize: 10,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="water"
                        stroke="#16886c"
                        strokeWidth={2.5}
                        fill="url(#waterFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-footer">
                  <span>
                    <i />
                    Tinggi muka air
                  </span>
                  <span>
                    <i className="dashed" />
                    Batas talut / limpasan
                  </span>
                  <button
                    onClick={() => {
                      setLimit(threshold);
                      setModal('Pengaturan ambang batas');
                    }}
                  >
                    <SlidersHorizontal size={13} />
                    Atur ambang batas
                  </button>
                </div>
              </article>

              <article className="panel condition-panel">
                <div className="panel-title">
                  <div>
                    <h2>Kondisi lokasi</h2>
                    <p>Lokasi terpilih saat ini</p>
                  </div>
                  <MapPin size={19} />
                </div>
                <h3>{station.name}</h3>
                <span className="location-sub">{station.area}</span>

                <div className={`condition-status ${statusColor(station.status)}`}>
                  <ShieldCheck size={21} />
                  <div>
                    <b>{station.status}</b>
                    <span>
                      {station.online
                        ? `${Math.abs(threshold - station.height)
                            .toFixed(2)
                            .replace('.', ',')} m ${
                            station.height > threshold
                              ? 'di atas'
                              : station.height === threshold
                              ? 'tepat pada'
                              : 'di bawah'
                          } batas talut`
                        : 'Data terakhir • koneksi terputus'}
                    </span>
                  </div>
                </div>

                <div className="level-diagram">
                  <div className="level-line">
                    <span>Batas talut</span>
                    <b>{threshold.toFixed(2)} m</b>
                  </div>
                  <div className="river-water">
                    <Waves size={25} />
                    <span>Muka air saat ini</span>
                    <b>{station.height.toFixed(2)} m</b>
                  </div>
                  <span className="river-base">Dasar sungai</span>
                </div>

                <div className="condition-metrics">
                  <div>
                    <CloudRain size={17} />
                    <span>
                      Curah hujan
                      <b>
                        {station.rain} <small>mm / hari</small>
                      </b>
                    </span>
                  </div>
                  <div>
                    <Radio size={17} />
                    <span>
                      Gateway
                      <b className="green-text">
                        <i />
                        {station.online ? 'Online' : 'Offline'}
                      </b>
                    </span>
                  </div>
                </div>

                <button className="location-detail" onClick={() => setModal('Detail lokasi')}>
                  Lihat detail lokasi
                  <ArrowRight size={15} />
                </button>
              </article>
            </section>
          )}

          {page === 'CCTV sungai' && (
            <section className="panel camera-section">
              <div className="panel-title">
                <div>
                  <h2>Pemantauan visual sungai</h2>
                  <p>Jalur CCTV terpisah dari data sensor • PTZ CCTV 4 MP</p>
                </div>
                <span className="badge gray">Pratinjau simulasi</span>
              </div>
              <div className="camera-grid">
                {stations.map((item, index) => (
                  <button
                    key={item.name}
                    className="camera-tile"
                    onClick={() => {
                      setSelected(index);
                      setModal('CCTV lokasi');
                    }}
                  >
                    <div className="camera-placeholder">
                      <Video size={32} />
                      <span>Stream belum terhubung</span>
                      <Maximize2 size={16} />
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.area}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {page === 'Perangkat & jaringan' && (
            <section className="panel network-panel">
              <div className="panel-title">
                <div>
                  <h2>Alur data & kesehatan perangkat</h2>
                  <p>Sensor → Gateway → Jaringan → Server → Operator</p>
                </div>
                <span className="badge green">
                  <i />
                  Sistem aktif
                </span>
              </div>
              <div className="network-grid">
                {[
                  'Radar water level',
                  'Tipping bucket',
                  'IoT Gateway',
                  'Jaringan seluler',
                  'Server / endpoint',
                ].map((item, index) => (
                  <div key={item}>
                    <Radio size={25} />
                    <h3>{item}</h3>
                    <p>{index === 0 ? '5 dari 6 online' : '6 dari 6 online'}</p>
                    <span className={`badge ${index === 0 ? 'amber' : 'green'}`}>
                      {index === 0 ? '1 offline' : 'Terhubung'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {page === 'Riwayat & laporan' && (
            <div className="report-wrapper">
              {/* 1. Filter Toolbar */}
              <div className="report-filter-bar">
                <div className="filter-group">
                  <span className="filter-label">
                    <MapPin size={14} /> Pos Sungai:
                  </span>
                  <select
                    aria-label="Pilih stasiun sungai"
                    value={reportStation}
                    onChange={(e) => setReportStation(e.target.value)}
                  >
                    <option value="all">Semua Pos Sungai (6 Stasiun)</option>
                    {stations.map((item, idx) => (
                      <option value={idx} key={item.name}>
                        {item.name} ({item.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <span className="filter-label">
                    <Calendar size={14} /> Periode:
                  </span>
                  <div className="segmented">
                    {['24 jam', '3 hari', '7 hari', '30 hari'].map((item) => (
                      <button
                        key={item}
                        className={reportPeriod === item ? 'selected' : ''}
                        onClick={() => setReportPeriod(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">
                    <Filter size={14} /> Filter Status:
                  </span>
                  <select
                    aria-label="Filter status laporan"
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                  >
                    <option>Semua status</option>
                    <option>Mendekati batas</option>
                    <option>Bahaya</option>
                    <option>Aman</option>
                    <option>Data terputus</option>
                  </select>
                </div>
              </div>

              {/* 2. Report KPI Summary Cards */}
              <div className="report-kpi-grid">
                <div className="report-kpi-card">
                  <div className="kpi-header">
                    <span>Tinggi Air Puncak (Peak)</span>
                    <TrendingUp size={17} className="kpi-icon-amber" />
                  </div>
                  <div className="kpi-value amber">
                    {reportMaxWater.toFixed(2).replace('.', ',')} <span>m</span>
                  </div>
                  <div className="kpi-footer">
                    <span>
                      {reportStation === 'all'
                        ? 'Sungai Banjir Kanal Timur'
                        : activeReportStation.name}
                    </span>
                    <small>Batas: {activeReportLimit.toFixed(2)} m</small>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-header">
                    <span>Intensitas Hujan Puncak</span>
                    <CloudRain size={17} className="kpi-icon-blue" />
                  </div>
                  <div className="kpi-value blue">
                    {reportMaxRain.toFixed(1).replace('.', ',')} <span>mm/jam</span>
                  </div>
                  <div className="kpi-footer">
                    <span>Sensor Tipping Bucket</span>
                    <small className="kpi-tag amber">Hujan Lebat</small>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-header">
                    <span>Akumulasi Hujan Periode</span>
                    <Droplets size={17} className="kpi-icon-green" />
                  </div>
                  <div className="kpi-value green">
                    {reportTotalRain.replace('.', ',')} <span>mm</span>
                  </div>
                  <div className="kpi-footer">
                    <span>Total curah hujan terukur</span>
                    <small>Periode {reportPeriod}</small>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-header">
                    <span>Log Peringatan Terpicu</span>
                    <Bell size={17} className={reportAlertEvents > 0 ? 'kpi-icon-amber' : 'kpi-icon-green'} />
                  </div>
                  <div className="kpi-value">
                    {reportAlertEvents} <span>kejadian</span>
                  </div>
                  <div className="kpi-footer">
                    <span>{reportAlertEvents > 0 ? 'Perlu atensi petugas' : 'Kondisi stabil'}</span>
                    <small className="uptime">Kesiapan 99,4%</small>
                  </div>
                </div>
              </div>

              {/* 3. Dual-Axis Historical Chart: Muka Air & Curah Hujan */}
              <article className="panel report-chart-panel">
                <div className="panel-title">
                  <div>
                    <h2>Korelasi Fluktuasi Muka Air vs Curah Hujan (Tipping Bucket)</h2>
                    <p>
                      Dinamika kenaikan tinggi muka air sungai terhadap intensitas hujan per jam ({reportStation === 'all' ? 'Sungai Banjir Kanal Timur' : activeReportStation.name})
                    </p>
                  </div>
                  <span className="badge green">
                    <i /> Sinkronisasi Telemetri
                  </span>
                </div>

                <div className="report-chart-container">
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={reportChartData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="reportWaterFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#13987a" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#13987a" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#e7ece9" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#819087' }}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 6]}
                        ticks={[0, 1.5, 3.0, 4.5, 6.0]}
                        tickFormatter={(v) => `${v.toFixed(1)} m`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#819087' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 30]}
                        ticks={[0, 10, 20, 30]}
                        tickFormatter={(v) => `${v} mm`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#3b82f6' }}
                      />
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          name === 'Tinggi muka air' ? `${Number(val).toFixed(2)} m` : `${Number(val).toFixed(1)} mm/jam`,
                          name,
                        ]}
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                      />
                      <ReferenceLine
                        yAxisId="left"
                        y={activeReportLimit}
                        stroke="#d89b35"
                        strokeDasharray="5 5"
                        label={{
                          value: `Batas Talut ${activeReportLimit.toFixed(2)} m`,
                          position: 'insideTopRight',
                          fill: '#a97724',
                          fontSize: 10,
                        }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="water"
                        name="Tinggi muka air"
                        stroke="#138568"
                        strokeWidth={2.5}
                        fill="url(#reportWaterFill)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="rain"
                        name="Curah hujan (tipping bucket)"
                        fill="#60a5fa"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={28}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* 4. Detailed Audit Log Table */}
              <article className="panel report-table-panel">
                <div className="panel-title">
                  <div>
                    <h2>Buku Catatan Log Historis Sensor & Peringatan</h2>
                    <p>Rekam jejak pengukuran sensor telemetri per interval waktu</p>
                  </div>
                  <div className="table-controls">
                    <label className="search-input">
                      <Search size={15} />
                      <input
                        placeholder="Cari waktu, stasiun, status..."
                        value={reportSearch}
                        onChange={(e) => setReportSearch(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>ID LOG</th>
                        <th>WAKTU CATAT</th>
                        <th>TITIK POS SUNGAI</th>
                        <th>TINGGI AIR</th>
                        <th>BATAS TALUT</th>
                        <th>CURAH HUJAN (TIPPING BUCKET)</th>
                        <th>STATUS</th>
                        <th>TINDAKAN / ALARM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReportLogs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <span className="log-id">{log.id}</span>
                          </td>
                          <td className="log-time">
                            <b>{log.time}</b>
                          </td>
                          <td>
                            <div className="table-location">
                              <span className="river-icon">
                                <Waves size={16} />
                              </span>
                              <div>
                                <b>{log.stationName}</b>
                                <span>{log.area}</span>
                              </div>
                            </div>
                          </td>
                          <td className="table-number">
                            <b>{log.height.toFixed(2).replace('.', ',')}</b> <span>m</span>
                            <span className={`delta-indicator ${log.deltaType}`}>
                              {log.delta}
                            </span>
                          </td>
                          <td className="table-number text-muted">
                            {log.limit.toFixed(2).replace('.', ',')} <span>m</span>
                          </td>
                          <td className="table-number">
                            <b>{log.rainHour.toFixed(1).replace('.', ',')}</b> <span>mm/jam</span>
                            <small className="rain-total">({log.rainTotal} mm/hari)</small>
                          </td>
                          <td>
                            <span className={`badge ${statusColor(log.status)}`}>
                              <i />
                              {log.status}
                            </span>
                          </td>
                          <td>
                            <span className="log-action">{log.action}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredReportLogs.length === 0 && (
                    <p className="empty">Tidak ada data log yang cocok dengan filter.</p>
                  )}
                </div>

                <div className="table-bottom">
                  <span>
                    Menampilkan <b>{filteredReportLogs.length}</b> dari {baseHistoricalLogs.length} rekaman log historis
                  </span>
                  <span>
                    <i className="live-dot" /> Integritas data terverifikasi • Dinas Pekerjaan Umum Kota Semarang
                  </span>
                </div>
              </article>
            </div>
          )}

          {page !== 'CCTV sungai' && page !== 'Perangkat & jaringan' && page !== 'Riwayat & laporan' && (
            <section className="panel locations-panel">
              <div className="panel-title">
                <div>
                  <h2>
                    Lokasi pemantauan <span className="title-count">6</span>
                  </h2>
                  <p>Status terkini seluruh titik pemantauan sungai</p>
                </div>
                <div className="table-controls">
                  {page === 'Lokasi pemantauan' && (
                    <label className="search-input">
                      <Search size={15} />
                      <input
                        placeholder="Cari lokasi..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>
                  )}
                  <select
                    aria-label="Filter status"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option>Semua status</option>
                    <option>Aman</option>
                    <option>Mendekati batas</option>
                    <option>Bahaya</option>
                    <option>Data terputus</option>
                  </select>
                  {page === 'Ringkasan' && (
                    <button className="text-button" onClick={() => setPage('Lokasi pemantauan')}>
                      Semua lokasi <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>LOKASI SUNGAI</th>
                      <th>TINGGI MUKA AIR</th>
                      <th>CURAH HUJAN</th>
                      <th>STATUS KONDISI</th>
                      <th>PERANGKAT</th>
                      <th>PEMBARUAN</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {shown.slice(0, page === 'Ringkasan' ? 4 : 6).map((item) => (
                      <tr
                        key={item.name}
                        onClick={() => {
                          setSelected(stations.indexOf(item));
                          setModal('Detail lokasi');
                        }}
                      >
                        <td>
                          <div className="table-location">
                            <span className="river-icon">
                              <Waves size={18} />
                            </span>
                            <div>
                              <b>{item.name}</b>
                              <span>{item.area}</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-number" data-label="Tinggi muka air">
                          {item.height.toFixed(2).replace('.', ',')} <span>m</span>
                        </td>
                        <td className="table-number" data-label="Curah hujan">
                          {item.rain} <span>mm</span>
                        </td>
                        <td className="location-status-cell" data-label="Kondisi">
                          <span className={`badge ${statusColor(item.status)}`}>
                            <i />
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Perangkat">
                          <span className={item.online ? 'connection' : 'connection offline'}>
                            <i />
                            {item.online ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="updated" data-label="Pembaruan">
                          {item.online ? 'Baru saja' : '35 menit lalu'}
                        </td>
                        <td className="location-action-cell">
                          <button aria-label={`Detail ${item.name}`}>
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shown.length === 0 && <p className="empty">Tidak ada lokasi yang cocok.</p>}
              </div>

              <div className="table-bottom">
                <span>
                  Menampilkan {Math.min(shown.length, page === 'Ringkasan' ? 4 : 6)} dari 6 lokasi
                </span>
                <span>
                  <i className="live-dot" />
                  Data sensor diperbarui setiap 60 detik <small>• simulasi</small>
                </span>
              </div>
            </section>
          )}

          <footer>
            <span>
              <ShieldCheck size={13} />
              Sistem Monitoring EWS · Dinas Pekerjaan Umum Kota Semarang
            </span>
            <span>
              Zona waktu: WIB (UTC+7)<span className="footer-dot">•</span>Versi 1.0
            </span>
          </footer>
        </main>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navigasi mobile">
        {nav.slice(0, 3).map((item, index) => (
          <button
            key={item.label}
            className={page === item.label ? 'active' : ''}
            aria-current={page === item.label ? 'page' : undefined}
            onClick={() => {
              setPage(item.label);
              setMobileMenu(false);
            }}
          >
            <item.icon size={21} />
            <span>{['Ringkasan', 'Lokasi', 'CCTV'][index]}</span>
          </button>
        ))}
        <button
          className={mobileMenu ? 'active' : ''}
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu size={21} />
          <span>Lainnya</span>
        </button>
      </nav>

      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
          <button aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal('')}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{modal}</h2>
              <button aria-label="Tutup" onClick={() => setModal('')}>
                <X size={20} />
              </button>
            </div>

            {modal === 'Pengaturan ambang batas' ? (
              <>
                <p>
                  Sesuaikan batas talut untuk {station.name}. Pengaturan ini hanya disimpan dalam sesi
                  desain.
                </p>
                <label className="form-label">
                  Batas talut (meter)
                  <input
                    type="number"
                    min={0.1}
                    max={15}
                    step={0.1}
                    value={limit}
                    onChange={(event) => setLimit(Number(event.target.value))}
                  />
                </label>
                <button
                  className="button primary"
                  onClick={() => {
                    if (limit > 0 && limit <= 15) {
                      setLimits({ ...limits, [selected]: limit });
                      setModal('');
                      setNotice('Ambang batas lokasi berhasil disimpan.');
                    }
                  }}
                >
                  Simpan ambang batas
                </button>
              </>
            ) : modal === 'Peringatan' ? (
              <>
                {alerts.length ? (
                  alerts.map((item) => (
                    <div
                      className={`alert-detail ${item.status === 'Bahaya' ? 'danger-banner' : ''}`}
                      key={item.name}
                    >
                      <CloudRain />
                      <div>
                        <h3>{item.name}</h3>
                        <span className={`badge ${statusColor(item.status)}`}>{item.status}</span>
                        <p>
                          Muka air {item.height.toFixed(2)} m{' '}
                          {item.status === 'Bahaya' ? 'melebihi' : 'mendekati'} batas talut{' '}
                          {item.limit.toFixed(2)} m. Curah hujan {item.rain} mm/hari.
                        </p>
                        <span>Data simulasi</span>
                        <button
                          className="button primary"
                          onClick={() => {
                            setSelected(stations.indexOf(item));
                            setModal('Detail lokasi');
                          }}
                        >
                          Pantau lokasi <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Tidak ada peringatan aktif.</p>
                )}
              </>
            ) : modal === 'Panduan pemantauan' ? (
              <>
                <p>
                  <b>Aman:</b> muka air berada di bawah ambang perhatian.
                </p>
                <p>
                  <b>Mendekati batas:</b> tingkatkan pemantauan tinggi muka air dan curah hujan.
                </p>
                <p>
                  <b>Bahaya:</b> muka air melebihi batas talut, ikuti prosedur tanggap darurat.
                </p>
                <p>
                  <b>Data terputus:</b> periksa koneksi gateway; jangan menganggap data lama sebagai
                  kondisi aktual.
                </p>
                <p>
                  CCTV dan pieschal digunakan sebagai referensi visual terpisah dari pengukuran sensor.
                  Ambang tiap lokasi perlu divalidasi oleh operator.
                </p>
              </>
            ) : modal === 'Akun operator' ? (
              <>
                <p>
                  <b>Nama Pengguna:</b> {currentUser.name}
                </p>
                <p>
                  <b>Peran Sistem:</b> {currentUser.role}
                </p>
                <p>
                  <b>Instansi:</b> {currentUser.agency}
                </p>
                <p>
                  <b>ID Petugas:</b> {currentUser.id}
                </p>
                <span className="badge green">
                  <i /> Sesi Aktif • Terverifikasi
                </span>
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <button
                    className="button"
                    style={{ width: '100%', color: '#b52d35', borderColor: '#edc9cc' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Keluar dari Sistem (Logout)
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{station.name}</h3>
                <p>{station.area}</p>
                <div className="detail-stats">
                  <div>
                    <Droplets />
                    <b>{station.height} m</b>
                    <span>Tinggi muka air</span>
                  </div>
                  <div>
                    <CloudRain />
                    <b>{station.rain} mm</b>
                    <span>Curah hujan</span>
                  </div>
                </div>
                <p>
                  Batas talut: <b>{threshold} m</b> · Status: <b>{station.status}</b>
                </p>
                <div className="camera-placeholder">
                  <Video size={30} />
                  <span>Pratinjau CCTV • stream belum terhubung</span>
                </div>
                <p className="modal-note">
                  Data simulasi. Sensor radar dan tipping bucket dikirim melalui IoT gateway; jalur
                  CCTV terpisah.
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
