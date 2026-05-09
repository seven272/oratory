import { Root, SplitLayout } from '@vkontakte/vkui'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'

import MainView from './views/MainView'

const App = () => {
  const { panel, view } = useActiveVkuiLocation()

  return (
    <SplitLayout>
      <Root activeView={view}>
        <MainView id="main_view" activePanel={panel} />
      </Root>
    </SplitLayout>
  )
}

export default App
