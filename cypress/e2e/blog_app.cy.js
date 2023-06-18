describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Kevin T',
      username: 'kevint',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login' ,function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login')
        .click()
      cy.get('#username')
        .type('kevint')
      cy.get('#password')
        .type('test')
      cy.get('#login-button')
        .click()
      cy.contains('Kevin T logged in')
    })

    it('login fails with incorrect password', function() {
      cy.contains('login')
        .click()
      cy.get('#username')
        .type('kevint')
      cy.get('#password')
        .type('incorrect')
      cy.get('#login-button')
        .click()

      cy.get('#error')
        .should('contain', 'Wrong credentials')

      cy.get('html').should('not.contain', 'Kevin T logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'kevint', password: 'test' })
    })

    it('a new blog can be created', function() {
      cy.contains('Add new blog')
        .click()
      cy.get('#title')
        .type('test')
      cy.get('#author')
        .type('testauthor')
      cy.get('#url')
        .type('www.test.com')
      cy.contains('add')
        .click()

      cy.contains('test - testauthor')
    })

    it('user can like a blog', function() {
      cy.contains('Add new blog')
        .click()
      cy.get('#title')
        .type('test')
      cy.get('#author')
        .type('testauthor')
      cy.get('#url')
        .type('www.test.com')
      cy.contains('add')
        .click()

      cy.contains('test - testauthor')
        .click()
      cy.contains('view')
        .click()
      cy.contains('0')
      cy.get('#like-button')
        .click()
      cy.contains('1')
    })

    it('user who created blog can delete it', function() {
      cy.contains('Add new blog')
        .click()
      cy.get('#title')
        .type('test')
      cy.get('#author')
        .type('testauthor')
      cy.get('#url')
        .type('www.test.com')
      cy.contains('add')
        .click()

      cy.contains('test - testauthor')
        .click()
      cy.contains('view')
        .click()
      cy.get('#remove')
        .click()

      cy.get('html').should('not.contain', 'test - testauthor')
    })
  })

  describe('Blogs ordered by likes', function() {
    beforeEach(function() {
      cy.login({ username: 'kevint', password: 'test' })
      cy.createBlog({ author: 'auth1', title: 'test1', url: 'www.test1.com' })
      cy.createBlog({ author: 'auth2', title: 'test2', url: 'www.test2.com' })
      cy.createBlog({ author: 'auth3', title: 'test3', url: 'www.test3.com' })

      cy.contains('test1').parent().parent().as('blog1')
      cy.contains('test2').parent().parent().as('blog2')
      cy.contains('test3').parent().parent().as('blog3')
    })

    it('they are ordered by number of likes', function() {
      cy.get('@blog1').contains('view').click()
      cy.get('@blog2').contains('view').click()
      cy.get('@blog3').contains('view').click()
      cy.get('@blog1').contains('like').as('like1')
      cy.get('@blog2').contains('like').as('like2')
      cy.get('@blog3').contains('like').as('like3')

      cy.get('@like2').click()
      cy.wait(500)
      cy.get('@like1').click()
      cy.wait(500)
      cy.get('@like1').click()
      cy.wait(500)
      cy.get('@like3').click()
      cy.wait(500)
      cy.get('@like3').click()
      cy.wait(500)
      cy.get('@like3').click()
      cy.wait(500)

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('3')
        cy.wrap(blogs[1]).contains('2')
        cy.wrap(blogs[2]).contains('1')
      })
    })
  })
})

