import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import Blog from './Blog'

describe('component tests', () => {
  let blog = {
    title: "test",
    author: "testauthor",
    url: "www.test.com",
    likes: 2
  }

  let mockUpdateBlog = jest.fn()
  let mockDeleteBlog = jest.fn()

  test('renders title and author', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )
    expect(component.container).toHaveTextContent(
      'test - testauthor'
    )
  })

  test('clicking the view button displays url and likes', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'www.test.com'
    )

    expect(component.container).toHaveTextContent(
      '2'
    )
  })
})

