// Підключаємо технологію express для back-end сервера
const express = require('express')
const { TRUE } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date().getTime()
    this.id = Math.random()
  }

  verifyId = (id) => this.id === id

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)
  // this.#list.findIndex((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, { name }) => {
    console.log(id, name)
    const product = this.getById(id)

    if (product) {
      this.update(product, name)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  // console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішне виконання дії',
      info: `Товар створено`,
      link: `/product-list`,
    },
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()
  // console.log(list)

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  console.log(id)

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успіх',
      info: `Товар видалено`,
      link: `/product-list`,
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  let { name, price, description } = req.body

  let result = false

  const product = Product.getById(Number(req.query.id))

  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: `Товар з тким ID не знайдено`,
        link: `/product-list`,
      },
    })
  }

  res.render('product-edit', {
    style: 'product-edit',

    data: {
      product,
    },
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  let { name, price, description, id } = req.body

  // let obj = { name, price, description }

  let result = true
  //console.log(req.body)
  const product = Product.getById(Number(id))
  console.log({ name, price, description, id })
  console.log(id)

  Product.update(product, { name, price, description })

  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Успіх',
      info: `Товар оновлено`,
      link: `/product-list`,
    },
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
