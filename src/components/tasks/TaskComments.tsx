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
import { TaskDependencies } from "./TaskDependencies";
import { reassignTask, uploadTaskDocument, createComment, getAllComments, likeComment, replyToComment } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  isEdited?: boolean;
  replies?: TaskComment[];
  likes?: number;
  isLiked?: boolean;
}

interface TaskCommentsProps {
  taskId: string;
  onAddComment: (comment: string) => void;
}

export const TaskComments = ({ 
  taskId, 
  onAddComment 
}: TaskCommentsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Load comments when component mounts or taskId changes
  const loadComments = async () => {
    setIsLoading(true);
    try {
      const result = await getAllComments(taskId);
      if (result.success && result.data) {
        // Transform API comments to match our interface
        const transformedComments = result.data.map((comment: any) => ({
          id: comment._id || comment.id,
          content: comment.content,
          userId: comment.user,
          userName: comment.user, // You might want to fetch user names separately
          timestamp: new Date(comment.createdAt || comment.timestamp),
          isEdited: comment.isEdited || false,
          replies: comment.replies || [],
          likes: comment.likes || 0,
          isLiked: false // You might want to track this per user
        }));
        setComments(transformedComments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast({
        title: "Error Loading Comments",
        description: "Failed to load comments for this task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (taskId) {
      loadComments();
    }
  }, [taskId]);

  const handleAddCommentLocal = async (comment: string) => {
    if (!comment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      console.log('Creating comment with data:', {
        content: comment,
        user: user.id,
        task: taskId
      });
      
      const result = await createComment({
        content: comment,
        user: user.email, // Using email as user identifier
        task: taskId
      });

      if (result.success) {
        // Add the new comment to local state
        const newCommentObj: TaskComment = {
          id: result.data._id || result.data.id || Date.now().toString(),
          content: comment,
          userId: user.email,
          userName: user.name,
          timestamp: new Date(),
          isEdited: false,
          replies: [],
          likes: 0,
          isLiked: false
        };
        
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment("");
        
        // Also call the parent handler for any additional logic
        onAddComment(comment);
        
        toast({
          title: "Comment Added",
          description: "Your comment has been posted successfully",
        });
      } else {
        console.error('Comment creation failed:', result.error);
        throw new Error(result.error || "Failed to create comment");
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error Adding Comment",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const result = await likeComment(commentId);
      if (result.success) {
        // Update local state
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: (comment.likes || 0) + 1, isLiked: true }
            : comment
        ));
        
        toast({
          title: "Comment Liked",
          description: "Your like has been recorded",
        });
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive"
      });
    }
  };

  const handleReplyToComment = async (parentId: string) => {
    if (!replyText.trim() || !user) return;

    try {
      const result = await replyToComment(parentId, {
        content: replyText,
        user: user.email,
        task: taskId
      });

      if (result.success) {
        // Reload comments to get the updated structure with replies
        await loadComments();
        setReplyText("");
        setReplyingTo(null);
        
        toast({
          title: "Reply Added",
          description: "Your reply has been posted successfully",
        });
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast({
        title: "Error Adding Reply",
        description: "Failed to post your reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: TaskComment; isReply?: boolean }) => (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {getAuthorInitials(comment.userName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.userName}</span>
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
          
          {/* Comment Actions */}
          {!isReply && (
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                disabled={comment.isLiked}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{comment.likes || 0}</span>
              </button>
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </button>
            </div>
          )}
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-16 text-sm"
                rows={2}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReplyToComment(comment.id)}
                  disabled={!replyText.trim()}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
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
              {getAuthorInitials(User?.name || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 text-sm"
              disabled={isSubmitting}
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
                  onClick={() => handleAddCommentLocal(newComment)}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-1" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};