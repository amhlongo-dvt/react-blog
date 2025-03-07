import { Post } from '../components/Post'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/Post',
  component: Post,
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    title: 'Hello',
    contents: 'Im a good boy and a billionaire',
    author: 'Mr. West',
  },
}
