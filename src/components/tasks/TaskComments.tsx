import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Reply, 
  ThumbsUp, 
  MoreVertical,
  User,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  author: string;
  authorName: string;
  timestamp: Date;
  isEdited?: boolean;
  replies?: Comment[];
  likes?: number;
  isLiked?: boolean;
}

interface TaskCommentsProps {
  taskId: string;
  onAddComment: (taskId: string, comment: string) => void;
}

export const TaskComments = ({ taskId, onAddComment }: TaskCommentsProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  
  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "I've started working on this task. The initial review shows we need additional documentation from the client.",
      author: "john.doe",
      authorName: "John Doe",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 2,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          content: "Which specific documents are we missing? I can reach out to the client today.",
          author: "jane.smith",
          authorName: "Jane Smith",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          likes: 0,
          isLiked: false
        }
      ]
    },
    {
      id: "2",
      content: "⚠️ Heads up: The deadline for this task has been moved up by 2 days. We need to prioritize this.",
      author: "mike.johnson",
      authorName: "Mike Johnson",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      likes: 1,
      isLiked: true
    }
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "current.user",
      authorName: "Current User",
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [...prev, comment]);
    onAddComment(taskId, newComment);
    setNewComment("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully",
    });
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: "current.user",
      authorName: "Current User",
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyContent("");
    setReplyTo(null);
    
    toast({
      title: "Reply Added",
      description: "Your reply has been posted successfully",
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? (comment.likes || 0) - 1 : (comment.likes || 0) + 1
        };
      }
      // Handle replies too
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? (reply.likes || 0) - 1 : (reply.likes || 0) + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {getAuthorInitials(comment.authorName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.authorName}</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
            </span>
            {comment.isEdited && (
              <Badge variant="outline" className="text-xs">edited</Badge>
            )}
          </div>
          
          <div className="text-sm">
            {comment.content}
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => handleLikeComment(comment.id)}
            >
              <ThumbsUp className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current text-blue-600' : ''}`} />
              {comment.likes || 0}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reply Input */}
      {replyTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-20 text-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleAddReply(comment.id)}
              disabled={!replyContent.trim()}
            >
              <Send className="w-3 h-3 mr-1" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {comments.length > 0 ? (
        <ScrollArea className="h-64">
          <div className="space-y-4 pr-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No comments yet</p>
          <p className="text-xs">Start a conversation about this task</p>
        </div>
      )}
      
      <Separator />
      
      {/* Add Comment */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {getAuthorInitials("Current User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 text-sm"
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                💡 Tip: Use @mention to notify team members
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewComment("")}
                  disabled={!newComment.trim()}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};