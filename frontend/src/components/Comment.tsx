import { useState } from "react";
import type { Comment } from "../types/download";

interface CommentsProps {
  initialComments: Comment[];
  currentUser?: { username: string; avatar: string };
}

interface CommentCardProps {
  comment: Comment;
  isReply?: boolean;
  onLike: (id: number) => void;
  onReply: (parentId: number, content: string) => void;
  currentUser: { username: string; avatar: string };
}

function CommentCard({
  comment,
  isReply = false,
  onLike,
  onReply,
  currentUser,
}: CommentCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handlePostReply = () => {
    const val = replyText.trim();
    if (!val) return;
    onReply(comment.id, val);
    setReplyText("");
    setReplyOpen(false);
  };

  const inner = (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="avatar-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
        {comment.avatar}
      </div>

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold">{comment.user}</span>
          <span className="text-xs text-[#f0f0f5]/30">{comment.date}</span>
        </div>

        {/* Body */}
        <p className="text-sm leading-relaxed text-[#f0f0f5]/75">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="mt-2.5 flex items-center gap-4">
          <button
            onClick={() => onLike(comment.id)}
            className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-xs text-[#f0f0f5]/35 transition-colors hover:text-[#ff6b6b]"
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {comment.likes}
          </button>

          {!isReply && (
            <button
              onClick={() => setReplyOpen((v) => !v)}
              className="cursor-pointer border-none bg-transparent text-xs text-[#f0f0f5]/35 transition-colors hover:text-[#f0f0f5]"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply box */}
        {!isReply && replyOpen && (
          <div className="mt-3 flex gap-2">
            <div className="avatar-grad flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {currentUser.avatar}
            </div>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostReply()}
              placeholder={`Reply to ${comment.user}...`}
              className="h-8 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 text-xs text-[#f0f0f5] transition-colors focus:border-[#e84040]/40 focus:outline-none"
            />
            <button
              onClick={handlePostReply}
              className="h-8 cursor-pointer rounded-xl border border-[#e84040]/30 bg-[#e84040]/20 px-3 text-xs font-semibold text-[#ff6b6b] transition-colors hover:bg-[#e84040]/30"
            >
              Post
            </button>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies.length > 0 && (
          <div className="reply-thread mt-3 flex flex-col gap-3">
            {comment.replies.map((r) => (
              <CommentCard
                key={r.id}
                comment={r}
                isReply
                onLike={onLike}
                onReply={onReply}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isReply) return inner;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111118]/70 p-4 backdrop-blur">
      {inner}
    </div>
  );
}

export default function Comments({
  initialComments,
  currentUser = { username: "user", avatar: "U" },
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newText, setNewText] = useState("");

  const handleLike = (id: number) => {
    const likeInList = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, likes: c.likes + 1 }
          : { ...c, replies: likeInList(c.replies) },
      );
    setComments((prev) => likeInList(prev));
  };

  const handleReply = (parentId: number, content: string) => {
    const reply: Comment = {
      id: Date.now(),
      user: currentUser.username,
      avatar: currentUser.avatar,
      content,
      date: "Just now",
      likes: 0,
      replies: [],
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c,
      ),
    );
  };

  const handlePost = () => {
    const val = newText.trim();
    if (!val) return;
    const comment: Comment = {
      id: Date.now(),
      user: currentUser.username,
      avatar: currentUser.avatar,
      content: val,
      date: "Just now",
      likes: 0,
      replies: [],
    };
    setComments((prev) => [comment, ...prev]);
    setNewText("");
  };

  return (
    <div>
      {/* New comment box */}
      <div className="mb-5 rounded-2xl border border-white/[0.08] bg-[#111118]/80 p-4 backdrop-blur-xl">
        <div className="flex gap-3">
          <div className="avatar-grad flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Write a comment..."
              className="comment-area w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 text-sm text-[#f0f0f5] transition-colors"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handlePost}
                className="h-8 cursor-pointer rounded-full border-none bg-[#e84040] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#ff6b6b]"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            onLike={handleLike}
            onReply={handleReply}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
