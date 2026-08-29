import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface NoteProps {
  onSave?: (text: string) => void;
}

const Note: React.FC<NoteProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleSave = () => {
    onSave?.(noteText);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-30 justify-center"
      >
        <FileText size={16} />
        {noteText ? 'Đã thêm ghi chú' : 'Ghi chú'}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Ghi chú cho đơn hàng"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        }
      >
        <div className="p-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-30 resize-none"
            placeholder="Nhập ghi chú cho cửa hàng..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default Note;