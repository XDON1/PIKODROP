document.addEventListener('DOMContentLoaded', function () {

  // ==================== ELEMEN ====================
  const daftarOpsiEl = document.getElementById('daftarOpsi');
  const inputOpsi = document.getElementById('opsiInput');
  const btnTambah = document.getElementById('btnTambah');
  const areaHasil = document.getElementById('areaHasil');
  const tombolMode = document.querySelectorAll('.mode-btn');
  const btnCaraPakai = document.getElementById('btnCaraPakai');
  const modalCaraPakai = document.getElementById('modalCaraPakai');
  const btnTutupModal = document.getElementById('btnTutupModal');

  let opsi = [];
  let pairwiseList = [];
  let pairwiseAktif = false;

  // ==================== FUNGSI DAFTAR OPSI ====================
  function renderDaftarOpsi() {
    daftarOpsiEl.innerHTML = '';

    if (opsi.length === 0) {
      daftarOpsiEl.innerHTML = `
        <li class="bg-white/5 px-3 py-2 rounded-lg text-gray-400 text-center border border-white/10">
          Belum ada pilihan. Yuk tambahkan!
        </li>
      `;
      return;
    }

    opsi.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/10';
      const span = document.createElement('span');
      span.textContent = item;
      span.className = 'text-gray-200';
      const btnHapus = document.createElement('button');
      btnHapus.textContent = '✕';
      btnHapus.className = 'text-red-400 hover:text-red-300 font-semibold ml-2';
      btnHapus.addEventListener('click', () => {
        opsi.splice(index, 1);
        renderDaftarOpsi();
      });
      li.appendChild(span);
      li.appendChild(btnHapus);
      daftarOpsiEl.appendChild(li);
    });
  }

  // ==================== TAMBAH OPSI ====================
  function tambahOpsi() {
    const nilai = inputOpsi.value.trim();
    if (nilai === '') {
      alert('Tulis dulu pilihannya ya!');
      return;
    }
    if (opsi.includes(nilai)) {
      alert('Pilihan itu sudah ada.');
      return;
    }
    opsi.push(nilai);
    inputOpsi.value = '';
    inputOpsi.focus();
    renderDaftarOpsi();
  }

  btnTambah.addEventListener('click', tambahOpsi);
  inputOpsi.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      tambahOpsi();
    }
  });

  // ==================== MODE DADU ====================
  function pilihAcak() {
    const index = Math.floor(Math.random() * opsi.length);
    return opsi[index];
  }

  function putarDadu() {
    if (opsi.length === 0) {
      areaHasil.innerHTML = `<p class="text-red-400 font-medium">Tambahkan dulu minimal satu pilihan!</p>`;
      return;
    }

    if (opsi.length === 1) {
      areaHasil.innerHTML = `
        <p class="text-sm text-gray-400">🎲 Keputusan Dadu:</p>
        <p class="text-3xl font-bold text-blue-400">${opsi[0]}</p>
      `;
      return;
    }

    let counter = 0;
    const totalIterasi = 15;
    const delay = 60;

    const interval = setInterval(() => {
      const acak = pilihAcak();
      areaHasil.innerHTML = `
        <p class="text-sm text-gray-400">🎲 Mengacak...</p>
        <p class="text-3xl font-bold text-white">${acak}</p>
      `;
      counter++;
      if (counter >= totalIterasi) {
        clearInterval(interval);
        const hasilFinal = pilihAcak();
        areaHasil.innerHTML = `
          <p class="text-sm text-gray-400">🎲 Keputusan Dadu:</p>
          <p class="text-3xl font-bold text-blue-400">${hasilFinal}</p>
        `;
      }
    }, delay);
  }

  // ==================== MODE PAIRWISE ====================
  function acakDuaItem(list) {
    const indeks1 = Math.floor(Math.random() * list.length);
    let indeks2 = Math.floor(Math.random() * list.length);
    while (indeks2 === indeks1) {
      indeks2 = Math.floor(Math.random() * list.length);
    }
    return [list[indeks1], list[indeks2]];
  }

  function tampilkanPertandingan(item1, item2) {
    areaHasil.innerHTML = `
      <p class="text-sm text-gray-400 mb-2">⚔️ Pilih salah satu:</p>
      <div class="grid grid-cols-2 gap-3 w-full">
        <button id="pilihanA" class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 px-2 rounded-xl transition">
          ${item1}
        </button>
        <button id="pilihanB" class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 px-2 rounded-xl transition">
          ${item2}
        </button>
      </div>
    `;

    document.getElementById('pilihanA').addEventListener('click', () => {
      prosesPemenang(item1);
    });
    document.getElementById('pilihanB').addEventListener('click', () => {
      prosesPemenang(item2);
    });
  }

  function prosesPemenang(pemenang) {
    pairwiseList.push(pemenang);

    if (pairwiseList.length > 1) {
      const [item1, item2] = acakDuaItem(pairwiseList);
      pairwiseList = pairwiseList.filter(item => item !== item1 && item !== item2);
      tampilkanPertandingan(item1, item2);
    } else {
      const hasil = pairwiseList[0];
      areaHasil.innerHTML = `
        <p class="text-sm text-gray-400">⚔️ Keputusan Pairwise:</p>
        <p class="text-3xl font-bold text-purple-400">${hasil}</p>
      `;
      pairwiseAktif = false;
    }
  }

  function mulaiPairwise() {
    if (opsi.length < 2) {
      areaHasil.innerHTML = `<p class="text-red-400 font-medium">Minimal butuh 2 pilihan untuk mode pairwise!</p>`;
      return;
    }

    pairwiseAktif = true;
    pairwiseList = [...opsi];

    const [item1, item2] = acakDuaItem(pairwiseList);
    pairwiseList = pairwiseList.filter(item => item !== item1 && item !== item2);
    tampilkanPertandingan(item1, item2);
  }

  // ==================== HANDLER TOMBOL MODE ====================
  tombolMode.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'dadu') {
        pairwiseAktif = false;
        putarDadu();
      } else if (mode === 'pairwise') {
        mulaiPairwise();
      }
    });
  });

  // ==================== MODAL CARA PAKAI ====================
  btnCaraPakai.addEventListener('click', () => {
    modalCaraPakai.classList.remove('hidden');
    modalCaraPakai.classList.add('flex');
  });

  btnTutupModal.addEventListener('click', () => {
    modalCaraPakai.classList.add('hidden');
    modalCaraPakai.classList.remove('flex');
  });

  modalCaraPakai.addEventListener('click', (e) => {
    if (e.target === modalCaraPakai) {
      modalCaraPakai.classList.add('hidden');
      modalCaraPakai.classList.remove('flex');
    }
  });

  // ==================== RENDER AWAL ====================
  renderDaftarOpsi();

});