import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  Ref,
} from 'react';
import { FolderFilled } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Tree, Modal, Button, Spin } from 'antd';
import styled from 'styled-components';
import { ConfigContext } from '../contexts/config';
import { Api } from '../services';
import { treeTransfer } from '../utils';

const Wrapper = styled.div`
  .ant-tree-treenode {
    .ant-tree-switcher {
      height: 32px;
      line-height: 32px;
    }
    .ant-tree-node-content-wrapper {
      padding: 4px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .ant-tree-iconEle {
        margin-right: 10px;
      }
    }
  }

  .modalFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

type TempData = {
  type: string;
  files: string[];
};

type SubmitData = { oldPath: string; newPath: string }[];

type PropsType = {
  submit: (type: string, temp: SubmitData) => void;
};

export interface RefAll {
  show: (temp: TempData) => void;
  hide: () => void;
  init: () => Promise<any>;
}

const FileDirAllCom = (props: PropsType, ref: Ref<RefAll>) => {
  const { submit } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [select, setSelect] = useState<React.ReactText[]>([]);
  const [temp, setTemp] = useState<TempData>();

  const { state } = useContext(ConfigContext);
  const color = useMemo(() => state.color, [state.color]);

  const initData = async () => {
    setLoading(true);
    const res = await Api.getAllFileList();
    if (res) {
      setData(
        treeTransfer(
          res,
          <FolderFilled
            style={{
              color: '#FFD659',
              fontSize: '26px',
            }}
          ></FolderFilled>,
        ),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  const methods = {
    init: initData,
    show: (value: any) => {
      setTemp(value);
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
      setSelect([]);
      setTemp(undefined);
    },
  };

  const onConfirm = () => {
    if (select.length > 0 && temp) {
      const { type, files } = temp;
      const newFiles = files.map(item => {
        const name = item.split('/').reverse()[0];
        return {
          oldPath: item,
          newPath: select[0] + '/' + name,
        };
      });
      submit(type, newFiles);
      methods.hide();
    }
  };

  useImperativeHandle(ref, () => methods);

  const showData = [
    {
      title: intl.get('files.header.home'),
      key: '',
      icon: (
        <FolderFilled
          style={{
            color: '#FFD659',
            fontSize: '26px',
          }}
        ></FolderFilled>
      ),
      children: data,
    },
  ];

  return (
    <Wrapper color={color}>
      <Modal
        visible={visible}
        width={600}
        getContainer={false}
        title={intl.get('files.modal.title.' + (temp ? temp.type : ''))}
        onCancel={methods.hide}
        onOk={onConfirm}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="modalFooter">
            <div className="left">
              <Button key="back" onClick={initData}>
                {intl.get('common.refresh')}
              </Button>
            </div>
            <div className="right">
              <Button key="back" onClick={methods.hide}>
                {intl.get('common.cancel')}
              </Button>
              <Button key="submit" type="primary" onClick={onConfirm}>
                {intl.get('common.confirm')}
              </Button>
            </div>
          </div>
        }
      >
        <Spin spinning={loading} size="large">
          <Tree
            treeData={showData}
            defaultExpandedKeys={['']}
            blockNode
            showIcon
            onSelect={val => setSelect(val)}
          ></Tree>
        </Spin>
      </Modal>
    </Wrapper>
  );
};

export const FileDirAll = forwardRef(FileDirAllCom);
