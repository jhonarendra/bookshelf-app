const main = () => {
	const data = {
		buku: [],
		bukuDummy: [
			{ id: 1, title: 'Tes', author: 'Tesss', year: 2020, isComplete: false},
			{ id: 2, title: 'Lorem', author: 'Halo', year: 1998, isComplete: true},
			{ id: 3, title: 'is', author: 'Tesss', year: 1999, isComplete: false},
			{ id: 4, title: 'Dolor SIte Api', author: 'Tesss', year: 2020, isComplete: false},
			{ id: 5, title: 'Tes Halo', author: 'Dunia', year: 2000, isComplete: true}
		],
		rakActive: 'sudah-dibaca',
		search: '',
		page: 'home'
	}

	const method = {
		loadBuku: () => {
			if(localStorage.buku){
				data.buku = JSON.parse(localStorage.getItem('buku'))
			} else {
				localStorage.setItem('buku', JSON.stringify(data.bukuDummy))
				data.buku = data.bukuDummy
			}
			method.renderBuku()
		},
		tambahBuku: () => {
			let title = document.querySelector('#judul-buku').value
			let author = document.querySelector('#penulis').value
			let year = document.querySelector('#tahun').value
			let isComplete = document.querySelector('#is-completed').checked

			data.buku.push({
				id: +new Date(),
				title: title,
				author: author,
				year: year,
				isComplete: isComplete
			})
			localStorage.setItem('buku', JSON.stringify(data.buku))
			method.resetForm()
			method.loadBuku()
			method.setPage('home')
			method.alert('success', `Berhasil menambah buku "${title}"`)
		},
		editBuku: id => {
			method.setPage('edit')
			let buku = data.buku.find(e => e.id == id)

			document.querySelector('#judul-buku').value = buku.title
			document.querySelector('#penulis').value = buku.author
			document.querySelector('#tahun').value = buku.year
			document.querySelector('#is-completed').checked = buku.isComplete
			document.querySelector('#buku-id').value = buku.id

		},
		updateBuku: id => {
			let buku = []
			let update = data.buku.find(e => e.id == id)
			data.buku.forEach(e => {
				if(e.id != id){
					buku.push(e)
				}
			})
			update.title = document.querySelector('#judul-buku').value
			update.author = document.querySelector('#penulis').value
			update.year = document.querySelector('#tahun').value
			update.isComplete = document.querySelector('#is-completed').checked
			buku.push(update)

			data.buku = buku
			localStorage.setItem('buku', JSON.stringify(data.buku))
			method.loadBuku()
			method.resetForm()
			method.setPage('home')
			method.alert('success', `Berhasil mengupdate buku`)
		},
		hapusBuku: id => {
			let buku = []
			data.buku.forEach(e => {
				if(e.id != id){
					buku.push(e)
				}
			})
			data.buku = buku
			localStorage.setItem('buku', JSON.stringify(data.buku))
			method.loadBuku()
			method.setPage('home')
			method.alert('success', `Berhasil menghapus buku`)
		},
		pindahRak: id => {
			let buku = []
			let pindah = data.buku.find(e => e.id == id)
			data.buku.forEach(e => {
				if(e.id != id){
					buku.push(e)
				}
			})
			pindah.isComplete = (!pindah.isComplete)
			buku.push(pindah)

			data.buku = buku
			localStorage.setItem('buku', JSON.stringify(data.buku))
			method.loadBuku()
			
			let namaRak = (pindah.isComplete) ? 'Sudah Dibaca' : 'Belum Selesai Dibaca'
			method.alert('success', `Berhasil memindah buku "${pindah.title}" ke rak ${namaRak}`)
		},
		alert: (mode, msg) => {
			let elAlert = document.querySelector('.alert')
			elAlert.classList.remove('success')
			elAlert.classList.remove('error')
			elAlert.classList.add(mode)
			elAlert.classList.add('show')
			elAlert.innerHTML = msg

			setTimeout(() => {
				elAlert.classList.remove('show')
			}, 3000)
		},
		resetForm: () => {
			document.querySelector('#judul-buku').value = ''
			document.querySelector('#penulis').value = ''
			document.querySelector('#tahun').value = ''
			document.querySelector('#is-completed').checked = false
		},
		renderBuku: () => {
			let buku = data.buku
			let bukuHtml = ``

			// filter by search
			if(data.search != ''){
				buku = buku.filter(e => e.title.toLowerCase().indexOf(data.search) > -1)
			}

			// filter by rak
			let isComplete = (data.rakActive === 'sudah-dibaca')
			let tmpBuku = []
			buku.forEach(e => {
				if(e.isComplete === isComplete){
					tmpBuku.push(e)
				}
			})
			buku = tmpBuku

			if(buku.length > 0){
				buku.forEach(e => {
					bukuHtml += `
						<article data-id="${e.id}">
							<h3>${e.title}</h3>
							<p>Penulis: ${e.author}</p>
							<p>Tahun: ${e.year}</p>
							<p class="action">
								<small>
									<a href="javascript:void(0)" class="btn-pindah-rak" data-id="${e.id}">Tandai ${(e.isComplete) ? 'Belum Selesai' : 'Sudah'} Dibaca</a> | <a href="javascript:void(0)" class="btn-edit" data-id="${e.id}">Edit</a> | <a href="javascript:void(0)" class="btn-hapus" data-id="${e.id}">Hapus</a>
								</small>
							</p>
						</article>
					`
				})
			} else {
				bukuHtml += `
					<article>
						<p class="text-center">Tidak ada data</p>
					</article>
				`
			}
			document.querySelector('#buku').innerHTML = bukuHtml

			document.querySelectorAll('.btn-pindah-rak').forEach(e => {
				e.addEventListener('click', () => {
					method.pindahRak(e.getAttribute('data-id'))
				})
			})
			document.querySelectorAll('.btn-edit').forEach(e => {
				e.addEventListener('click', () => {
					method.editBuku(e.getAttribute('data-id'))
				})
			})
			document.querySelectorAll('.btn-hapus').forEach(e => {
				e.addEventListener('click', () => {
					method.hapusBuku(e.getAttribute('data-id'))
				})
			})
		},
		setRakActive: val => {
			data.rakActive = val
			document.querySelectorAll('.rak-pill').forEach( e => {
				if(e.getAttribute('data-id') === val){
					e.setAttribute('class', 'pill active rak-pill')
				} else {
					e.setAttribute('class', 'pill rak-pill')
				}
			})
			let elRakTitle = document.querySelector('#rak-title')
			if(val === 'sudah-dibaca'){
				elRakTitle.innerHTML = 'Sudah Dibaca'
			} else {
				elRakTitle.innerHTML = 'Belum Selesai Dibaca'
			}
			
			method.loadBuku()
		},
		searchBuku: key => {
			data.search = key
			document.querySelector('#search-key').innerHTML = key
			let elSearchAlert = document.querySelector('#search-alert')
			if(key === ''){
				elSearchAlert.setAttribute('class', 'hide')
			} else {
				elSearchAlert.setAttribute('class', '')
			}
			method.loadBuku()
		},
		setPage: val => {
			data.page = val
			let elRak = document.querySelector('#rak')
			let elContent = document.querySelector('#content')
			let elTambah = document.querySelector('#tambah-buku')
			let elBtnTambah = document.querySelector('#btn-tambah-buku')
			if(data.page === 'home'){
				elRak.style.display = 'block'
				elContent.style.display = 'block'
				elBtnTambah.style.display = 'block'
				elTambah.style.display = 'none'
			} else if(data.page === 'tambah'){
				method.resetForm()
				document.querySelector('#title-tambah-buku').innerHTML = 'Tambah Buku'
				elRak.style.display = 'none'
				elContent.style.display = 'none'
				elBtnTambah.style.display = 'none'
				elTambah.style.display = 'block'
			} else if(data.page === 'edit'){
				document.querySelector('#title-tambah-buku').innerHTML = 'Edit Buku'
				elRak.style.display = 'none'
				elContent.style.display = 'none'
				elBtnTambah.style.display = 'none'
				elTambah.style.display = 'block'
			}
		}
	}


	const render = () => {
		method.setRakActive('sudah-dibaca')
		method.setPage('home')


		document.querySelectorAll('.rak-pill').forEach( e => {
			e.addEventListener('click', () => {
				method.setRakActive(e.getAttribute('data-id'))
			})
		})


		document.querySelector('#search-form').addEventListener('submit', e => {
			e.preventDefault()
			method.searchBuku(document.querySelector('#search-input').value)
		})


		document.querySelector('#clear-search').addEventListener('click', () => {
			method.searchBuku('')
			document.querySelector('#search-input').value = ''
		})

		document.querySelector('#btn-tambah-buku').addEventListener('click', () => {
			method.setPage('tambah')
		})

		document.querySelector('#btn-home').addEventListener('click', () => {
			method.setPage('home')
		})

		document.querySelector('#form-tambah-buku').addEventListener('submit', e => {
			e.preventDefault()
			if(data.page === 'tambah'){
				method.tambahBuku()
			} else if(data.page === 'edit'){
				method.updateBuku(document.querySelector('#buku-id').value)
			}
			
		})
	}
	

	render()
}


document.addEventListener("DOMContentLoaded", main)