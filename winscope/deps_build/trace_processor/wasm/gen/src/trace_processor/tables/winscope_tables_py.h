#ifndef SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <tuple>
#include <type_traits>
#include <utility>
#include <variant>
#include <vector>

#include "perfetto/base/compiler.h"
#include "perfetto/base/logging.h"
#include "perfetto/public/compiler.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/dataframe/dataframe.h"
#include "src/trace_processor/dataframe/specs.h"
#include "src/trace_processor/dataframe/typed_cursor.h"
#include "src/trace_processor/tables/macros_internal.h"



namespace perfetto::trace_processor::tables {

class WinscopeRectTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","x","y","w","h"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WinscopeRectTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WinscopeRectTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t x = 1;
    static constexpr uint32_t y = 2;
    static constexpr uint32_t w = 3;
    static constexpr uint32_t h = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(WinscopeRectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WinscopeRectTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WinscopeRectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WinscopeRectTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WinscopeRectTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      WinscopeRectTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WinscopeRectTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WinscopeRectTable::Id id() const {
        
        return WinscopeRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const WinscopeRectTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(double _x = {}, double _y = {}, double _w = {}, double _h = {}) : x(std::move(_x)), y(std::move(_y)), w(std::move(_w)), h(std::move(_h)) {}

    bool operator==(const Row& other) const {
      return std::tie(x, y, w, h) ==
             std::tie(other.x, other.y, other.w, other.h);
    }

        double x;
    double y;
    double w;
    double h;
  };

  explicit WinscopeRectTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.x, row.y, row.w, row.h);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_winscope_rect";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WinscopeTransformTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","dsdx","dtdx","tx","dtdy","dsdy","ty"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WinscopeTransformTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WinscopeTransformTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t dsdx = 1;
    static constexpr uint32_t dtdx = 2;
    static constexpr uint32_t tx = 3;
    static constexpr uint32_t dtdy = 4;
    static constexpr uint32_t dsdy = 5;
    static constexpr uint32_t ty = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(WinscopeTransformTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WinscopeTransformTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WinscopeTransformTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WinscopeTransformTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WinscopeTransformTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      WinscopeTransformTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WinscopeTransformTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WinscopeTransformTable::Id id() const {
        
        return WinscopeTransformTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const WinscopeTransformTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(double _dsdx = {}, double _dtdx = {}, double _tx = {}, double _dtdy = {}, double _dsdy = {}, double _ty = {}) : dsdx(std::move(_dsdx)), dtdx(std::move(_dtdx)), tx(std::move(_tx)), dtdy(std::move(_dtdy)), dsdy(std::move(_dsdy)), ty(std::move(_ty)) {}

    bool operator==(const Row& other) const {
      return std::tie(dsdx, dtdx, tx, dtdy, dsdy, ty) ==
             std::tie(other.dsdx, other.dtdx, other.tx, other.dtdy, other.dsdy, other.ty);
    }

        double dsdx;
    double dtdx;
    double tx;
    double dtdy;
    double dsdy;
    double ty;
  };

  explicit WinscopeTransformTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.dsdx, row.dtdx, row.tx, row.dtdy, row.dsdy, row.ty);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_winscope_transform";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WinscopeTraceRectTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","rect_id","group_id","depth","is_spy","is_visible","opacity","transform_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WinscopeTraceRectTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WinscopeTraceRectTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t rect_id = 1;
    static constexpr uint32_t group_id = 2;
    static constexpr uint32_t depth = 3;
    static constexpr uint32_t is_spy = 4;
    static constexpr uint32_t is_visible = 5;
    static constexpr uint32_t opacity = 6;
    static constexpr uint32_t transform_id = 7;
  };
  struct RowReference {
   public:
    explicit RowReference(WinscopeTraceRectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WinscopeTraceRectTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WinscopeTraceRectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WinscopeTraceRectTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WinscopeTraceRectTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      WinscopeTraceRectTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WinscopeTraceRectTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WinscopeTraceRectTable::Id id() const {
        
        return WinscopeTraceRectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const WinscopeTraceRectTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(WinscopeRectTable::Id _rect_id = {}, uint32_t _group_id = {}, uint32_t _depth = {}, int64_t _is_spy = {}, int64_t _is_visible = {}, std::optional<double> _opacity = {}, WinscopeTransformTable::Id _transform_id = {}) : rect_id(std::move(_rect_id)), group_id(std::move(_group_id)), depth(std::move(_depth)), is_spy(std::move(_is_spy)), is_visible(std::move(_is_visible)), opacity(std::move(_opacity)), transform_id(std::move(_transform_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(rect_id, group_id, depth, is_spy, is_visible, opacity, transform_id) ==
             std::tie(other.rect_id, other.group_id, other.depth, other.is_spy, other.is_visible, other.opacity, other.transform_id);
    }

        WinscopeRectTable::Id rect_id;
    uint32_t group_id;
    uint32_t depth;
    int64_t is_spy;
    int64_t is_visible;
    std::optional<double> opacity;
    WinscopeTransformTable::Id transform_id;
  };

  explicit WinscopeTraceRectTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.rect_id.value, row.group_id, row.depth, row.is_spy, row.is_visible, row.opacity, row.transform_id.value);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_winscope_trace_rect";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class InputMethodClientsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(InputMethodClientsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const InputMethodClientsTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(InputMethodClientsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    InputMethodClientsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const InputMethodClientsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const InputMethodClientsTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(InputMethodClientsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      InputMethodClientsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const InputMethodClientsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      InputMethodClientsTable::Id id() const {
        
        return InputMethodClientsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const InputMethodClientsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit InputMethodClientsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_inputmethod_clients";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class InputMethodManagerServiceTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(InputMethodManagerServiceTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const InputMethodManagerServiceTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(InputMethodManagerServiceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    InputMethodManagerServiceTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const InputMethodManagerServiceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const InputMethodManagerServiceTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(InputMethodManagerServiceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      InputMethodManagerServiceTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const InputMethodManagerServiceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      InputMethodManagerServiceTable::Id id() const {
        
        return InputMethodManagerServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const InputMethodManagerServiceTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit InputMethodManagerServiceTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_inputmethod_manager_service";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class InputMethodServiceTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(InputMethodServiceTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const InputMethodServiceTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(InputMethodServiceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    InputMethodServiceTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const InputMethodServiceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const InputMethodServiceTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(InputMethodServiceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      InputMethodServiceTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const InputMethodServiceTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      InputMethodServiceTable::Id id() const {
        
        return InputMethodServiceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const InputMethodServiceTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit InputMethodServiceTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_inputmethod_service";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerLayersSnapshotTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id","sequence_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerLayersSnapshotTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerLayersSnapshotTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
    static constexpr uint32_t sequence_id = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerLayersSnapshotTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerLayersSnapshotTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerLayersSnapshotTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerLayersSnapshotTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerLayersSnapshotTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      SurfaceFlingerLayersSnapshotTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerLayersSnapshotTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerLayersSnapshotTable::Id id() const {
        
        return SurfaceFlingerLayersSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const SurfaceFlingerLayersSnapshotTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}, uint32_t _sequence_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)), sequence_id(std::move(_sequence_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id, sequence_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id, other.sequence_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
    uint32_t sequence_id;
  };

  explicit SurfaceFlingerLayersSnapshotTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id, row.sequence_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "surfaceflinger_layers_snapshot";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerDisplayTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","snapshot_id","is_on","is_virtual","trace_rect_id","display_id","display_name"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerDisplayTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerDisplayTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t is_on = 2;
    static constexpr uint32_t is_virtual = 3;
    static constexpr uint32_t trace_rect_id = 4;
    static constexpr uint32_t display_id = 5;
    static constexpr uint32_t display_name = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerDisplayTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerDisplayTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerDisplayTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerDisplayTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerDisplayTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      SurfaceFlingerDisplayTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerDisplayTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerDisplayTable::Id id() const {
        
        return SurfaceFlingerDisplayTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const SurfaceFlingerDisplayTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(SurfaceFlingerLayersSnapshotTable::Id _snapshot_id = {}, int64_t _is_on = {}, int64_t _is_virtual = {}, WinscopeTraceRectTable::Id _trace_rect_id = {}, int64_t _display_id = {}, std::optional<StringPool::Id> _display_name = {}) : snapshot_id(std::move(_snapshot_id)), is_on(std::move(_is_on)), is_virtual(std::move(_is_virtual)), trace_rect_id(std::move(_trace_rect_id)), display_id(std::move(_display_id)), display_name(std::move(_display_name)) {}

    bool operator==(const Row& other) const {
      return std::tie(snapshot_id, is_on, is_virtual, trace_rect_id, display_id, display_name) ==
             std::tie(other.snapshot_id, other.is_on, other.is_virtual, other.trace_rect_id, other.display_id, other.display_name);
    }

        SurfaceFlingerLayersSnapshotTable::Id snapshot_id;
    int64_t is_on;
    int64_t is_virtual;
    WinscopeTraceRectTable::Id trace_rect_id;
    int64_t display_id;
    std::optional<StringPool::Id> display_name;
  };

  explicit SurfaceFlingerDisplayTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.snapshot_id.value, row.is_on, row.is_virtual, row.trace_rect_id.value, row.display_id, row.display_name && row.display_name != StringPool::Id::Null() ? std::make_optional(*row.display_name) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_surfaceflinger_display";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerLayerTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","snapshot_id","arg_set_id","base64_proto_id","layer_id","layer_name","is_visible","parent","corner_radius_tl","corner_radius_tr","corner_radius_bl","corner_radius_br","hwc_composition_type","is_hidden_by_policy","z_order_relative_of","is_missing_z_parent","layer_rect_id","input_rect_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerLayerTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerLayerTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
    static constexpr uint32_t layer_id = 4;
    static constexpr uint32_t layer_name = 5;
    static constexpr uint32_t is_visible = 6;
    static constexpr uint32_t parent = 7;
    static constexpr uint32_t corner_radius_tl = 8;
    static constexpr uint32_t corner_radius_tr = 9;
    static constexpr uint32_t corner_radius_bl = 10;
    static constexpr uint32_t corner_radius_br = 11;
    static constexpr uint32_t hwc_composition_type = 12;
    static constexpr uint32_t is_hidden_by_policy = 13;
    static constexpr uint32_t z_order_relative_of = 14;
    static constexpr uint32_t is_missing_z_parent = 15;
    static constexpr uint32_t layer_rect_id = 16;
    static constexpr uint32_t input_rect_id = 17;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerLayerTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerLayerTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerLayerTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerLayerTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerLayerTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      SurfaceFlingerLayerTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerLayerTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerLayerTable::Id id() const {
        
        return SurfaceFlingerLayerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const SurfaceFlingerLayerTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(SurfaceFlingerLayersSnapshotTable::Id _snapshot_id = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}, std::optional<int64_t> _layer_id = {}, std::optional<StringPool::Id> _layer_name = {}, int64_t _is_visible = {}, std::optional<int64_t> _parent = {}, std::optional<double> _corner_radius_tl = {}, std::optional<double> _corner_radius_tr = {}, std::optional<double> _corner_radius_bl = {}, std::optional<double> _corner_radius_br = {}, std::optional<int64_t> _hwc_composition_type = {}, int64_t _is_hidden_by_policy = {}, std::optional<int64_t> _z_order_relative_of = {}, int64_t _is_missing_z_parent = {}, std::optional<WinscopeTraceRectTable::Id> _layer_rect_id = {}, std::optional<WinscopeTraceRectTable::Id> _input_rect_id = {}) : snapshot_id(std::move(_snapshot_id)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)), layer_id(std::move(_layer_id)), layer_name(std::move(_layer_name)), is_visible(std::move(_is_visible)), parent(std::move(_parent)), corner_radius_tl(std::move(_corner_radius_tl)), corner_radius_tr(std::move(_corner_radius_tr)), corner_radius_bl(std::move(_corner_radius_bl)), corner_radius_br(std::move(_corner_radius_br)), hwc_composition_type(std::move(_hwc_composition_type)), is_hidden_by_policy(std::move(_is_hidden_by_policy)), z_order_relative_of(std::move(_z_order_relative_of)), is_missing_z_parent(std::move(_is_missing_z_parent)), layer_rect_id(std::move(_layer_rect_id)), input_rect_id(std::move(_input_rect_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(snapshot_id, arg_set_id, base64_proto_id, layer_id, layer_name, is_visible, parent, corner_radius_tl, corner_radius_tr, corner_radius_bl, corner_radius_br, hwc_composition_type, is_hidden_by_policy, z_order_relative_of, is_missing_z_parent, layer_rect_id, input_rect_id) ==
             std::tie(other.snapshot_id, other.arg_set_id, other.base64_proto_id, other.layer_id, other.layer_name, other.is_visible, other.parent, other.corner_radius_tl, other.corner_radius_tr, other.corner_radius_bl, other.corner_radius_br, other.hwc_composition_type, other.is_hidden_by_policy, other.z_order_relative_of, other.is_missing_z_parent, other.layer_rect_id, other.input_rect_id);
    }

        SurfaceFlingerLayersSnapshotTable::Id snapshot_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
    std::optional<int64_t> layer_id;
    std::optional<StringPool::Id> layer_name;
    int64_t is_visible;
    std::optional<int64_t> parent;
    std::optional<double> corner_radius_tl;
    std::optional<double> corner_radius_tr;
    std::optional<double> corner_radius_bl;
    std::optional<double> corner_radius_br;
    std::optional<int64_t> hwc_composition_type;
    int64_t is_hidden_by_policy;
    std::optional<int64_t> z_order_relative_of;
    int64_t is_missing_z_parent;
    std::optional<WinscopeTraceRectTable::Id> layer_rect_id;
    std::optional<WinscopeTraceRectTable::Id> input_rect_id;
  };

  explicit SurfaceFlingerLayerTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.snapshot_id.value, row.arg_set_id, row.base64_proto_id, row.layer_id, row.layer_name && row.layer_name != StringPool::Id::Null() ? std::make_optional(*row.layer_name) : std::nullopt, row.is_visible, row.parent, row.corner_radius_tl, row.corner_radius_tr, row.corner_radius_bl, row.corner_radius_br, row.hwc_composition_type, row.is_hidden_by_policy, row.z_order_relative_of, row.is_missing_z_parent, row.layer_rect_id ? std::make_optional(row.layer_rect_id->value) : std::nullopt, row.input_rect_id ? std::make_optional(row.input_rect_id->value) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "surfaceflinger_layer";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WinscopeFillRegionTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","trace_rect_id","rect_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WinscopeFillRegionTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WinscopeFillRegionTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t trace_rect_id = 1;
    static constexpr uint32_t rect_id = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(WinscopeFillRegionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WinscopeFillRegionTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WinscopeFillRegionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WinscopeFillRegionTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WinscopeFillRegionTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      WinscopeFillRegionTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WinscopeFillRegionTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WinscopeFillRegionTable::Id id() const {
        
        return WinscopeFillRegionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const WinscopeFillRegionTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(WinscopeTraceRectTable::Id _trace_rect_id = {}, WinscopeRectTable::Id _rect_id = {}) : trace_rect_id(std::move(_trace_rect_id)), rect_id(std::move(_rect_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(trace_rect_id, rect_id) ==
             std::tie(other.trace_rect_id, other.rect_id);
    }

        WinscopeTraceRectTable::Id trace_rect_id;
    WinscopeRectTable::Id rect_id;
  };

  explicit WinscopeFillRegionTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.trace_rect_id.value, row.rect_id.value);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_winscope_fill_region";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerTransactionsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id","vsync_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerTransactionsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerTransactionsTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
    static constexpr uint32_t vsync_id = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerTransactionsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerTransactionsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerTransactionsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerTransactionsTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerTransactionsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      SurfaceFlingerTransactionsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerTransactionsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerTransactionsTable::Id id() const {
        
        return SurfaceFlingerTransactionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const SurfaceFlingerTransactionsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}, std::optional<int64_t> _vsync_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)), vsync_id(std::move(_vsync_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id, vsync_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id, other.vsync_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
    std::optional<int64_t> vsync_id;
  };

  explicit SurfaceFlingerTransactionsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id, row.vsync_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "surfaceflinger_transactions";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerTransactionTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","snapshot_id","arg_set_id","base64_proto_id","transaction_id","pid","uid","layer_id","display_id","flags_id","transaction_type"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerTransactionTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerTransactionTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
    static constexpr uint32_t transaction_id = 4;
    static constexpr uint32_t pid = 5;
    static constexpr uint32_t uid = 6;
    static constexpr uint32_t layer_id = 7;
    static constexpr uint32_t display_id = 8;
    static constexpr uint32_t flags_id = 9;
    static constexpr uint32_t transaction_type = 10;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerTransactionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerTransactionTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerTransactionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerTransactionTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerTransactionTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      SurfaceFlingerTransactionTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerTransactionTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerTransactionTable::Id id() const {
        
        return SurfaceFlingerTransactionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const SurfaceFlingerTransactionTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(SurfaceFlingerTransactionsTable::Id _snapshot_id = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}, std::optional<int64_t> _transaction_id = {}, std::optional<uint32_t> _pid = {}, std::optional<uint32_t> _uid = {}, std::optional<uint32_t> _layer_id = {}, std::optional<uint32_t> _display_id = {}, std::optional<uint32_t> _flags_id = {}, std::optional<StringPool::Id> _transaction_type = {}) : snapshot_id(std::move(_snapshot_id)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)), transaction_id(std::move(_transaction_id)), pid(std::move(_pid)), uid(std::move(_uid)), layer_id(std::move(_layer_id)), display_id(std::move(_display_id)), flags_id(std::move(_flags_id)), transaction_type(std::move(_transaction_type)) {}

    bool operator==(const Row& other) const {
      return std::tie(snapshot_id, arg_set_id, base64_proto_id, transaction_id, pid, uid, layer_id, display_id, flags_id, transaction_type) ==
             std::tie(other.snapshot_id, other.arg_set_id, other.base64_proto_id, other.transaction_id, other.pid, other.uid, other.layer_id, other.display_id, other.flags_id, other.transaction_type);
    }

        SurfaceFlingerTransactionsTable::Id snapshot_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
    std::optional<int64_t> transaction_id;
    std::optional<uint32_t> pid;
    std::optional<uint32_t> uid;
    std::optional<uint32_t> layer_id;
    std::optional<uint32_t> display_id;
    std::optional<uint32_t> flags_id;
    std::optional<StringPool::Id> transaction_type;
  };

  explicit SurfaceFlingerTransactionTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.snapshot_id.value, row.arg_set_id, row.base64_proto_id, row.transaction_id, row.pid, row.uid, row.layer_id, row.display_id, row.flags_id, row.transaction_type && row.transaction_type != StringPool::Id::Null() ? std::make_optional(*row.transaction_type) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_surfaceflinger_transaction";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class SurfaceFlingerTransactionFlagTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","flags_id","flag"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(SurfaceFlingerTransactionFlagTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SurfaceFlingerTransactionFlagTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t flags_id = 1;
    static constexpr uint32_t flag = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(SurfaceFlingerTransactionFlagTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SurfaceFlingerTransactionFlagTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SurfaceFlingerTransactionFlagTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SurfaceFlingerTransactionFlagTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SurfaceFlingerTransactionFlagTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      SurfaceFlingerTransactionFlagTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SurfaceFlingerTransactionFlagTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      SurfaceFlingerTransactionFlagTable::Id id() const {
        
        return SurfaceFlingerTransactionFlagTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const SurfaceFlingerTransactionFlagTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(std::optional<uint32_t> _flags_id = {}, std::optional<StringPool::Id> _flag = {}) : flags_id(std::move(_flags_id)), flag(std::move(_flag)) {}

    bool operator==(const Row& other) const {
      return std::tie(flags_id, flag) ==
             std::tie(other.flags_id, other.flag);
    }

        std::optional<uint32_t> flags_id;
    std::optional<StringPool::Id> flag;
  };

  explicit SurfaceFlingerTransactionFlagTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.flags_id, row.flag && row.flag != StringPool::Id::Null() ? std::make_optional(*row.flag) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_surfaceflinger_transaction_flag";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class ViewCaptureTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(ViewCaptureTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ViewCaptureTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(ViewCaptureTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ViewCaptureTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ViewCaptureTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ViewCaptureTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ViewCaptureTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      ViewCaptureTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ViewCaptureTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      ViewCaptureTable::Id id() const {
        
        return ViewCaptureTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const ViewCaptureTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit ViewCaptureTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_viewcapture";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class ViewCaptureViewTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","snapshot_id","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(ViewCaptureViewTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ViewCaptureViewTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t snapshot_id = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(ViewCaptureViewTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ViewCaptureViewTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ViewCaptureViewTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ViewCaptureViewTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ViewCaptureViewTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      ViewCaptureViewTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ViewCaptureViewTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      ViewCaptureViewTable::Id id() const {
        
        return ViewCaptureViewTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const ViewCaptureViewTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(ViewCaptureTable::Id _snapshot_id = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : snapshot_id(std::move(_snapshot_id)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(snapshot_id, arg_set_id, base64_proto_id) ==
             std::tie(other.snapshot_id, other.arg_set_id, other.base64_proto_id);
    }

        ViewCaptureTable::Id snapshot_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit ViewCaptureViewTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.snapshot_id.value, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_viewcapture_view";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class ViewCaptureInternedDataTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","base64_proto_id","flat_key","iid","deinterned_value"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(ViewCaptureInternedDataTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ViewCaptureInternedDataTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t base64_proto_id = 1;
    static constexpr uint32_t flat_key = 2;
    static constexpr uint32_t iid = 3;
    static constexpr uint32_t deinterned_value = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(ViewCaptureInternedDataTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t iid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::iid>(kSpec, row_);
    }
          StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    void set_base64_proto_id(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ViewCaptureInternedDataTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ViewCaptureInternedDataTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t iid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::iid>(kSpec, row_);
    }
          StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ViewCaptureInternedDataTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
      StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::flat_key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t iid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::iid>(kSpec);
    }
      StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
      StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::flat_key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t iid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::iid>(kSpec);
    }
      StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    void set_base64_proto_id(uint32_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ViewCaptureInternedDataTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t iid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::iid>(kSpec, row_);
    }
          StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      void set_base64_proto_id(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      ViewCaptureInternedDataTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ViewCaptureInternedDataTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      ViewCaptureInternedDataTable::Id id() const {
        
        return ViewCaptureInternedDataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t iid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::iid>(kSpec, row_);
    }
          StringPool::Id deinterned_value() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deinterned_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const ViewCaptureInternedDataTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _base64_proto_id = {}, StringPool::Id _flat_key = {}, int64_t _iid = {}, StringPool::Id _deinterned_value = {}) : base64_proto_id(std::move(_base64_proto_id)), flat_key(std::move(_flat_key)), iid(std::move(_iid)), deinterned_value(std::move(_deinterned_value)) {}

    bool operator==(const Row& other) const {
      return std::tie(base64_proto_id, flat_key, iid, deinterned_value) ==
             std::tie(other.base64_proto_id, other.flat_key, other.iid, other.deinterned_value);
    }

        uint32_t base64_proto_id;
    StringPool::Id flat_key;
    int64_t iid;
    StringPool::Id deinterned_value;
  };

  explicit ViewCaptureInternedDataTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.base64_proto_id, row.flat_key != StringPool::Id::Null() ? std::make_optional(row.flat_key) : std::nullopt, row.iid, row.deinterned_value != StringPool::Id::Null() ? std::make_optional(row.deinterned_value) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_viewcapture_interned_data";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WindowManagerShellTransitionsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","transition_id","arg_set_id","transition_type","send_time_ns","dispatch_time_ns","duration_ns","finish_time_ns","shell_abort_time_ns","handler","status","flags","start_transaction_id","finish_transaction_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WindowManagerShellTransitionsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WindowManagerShellTransitionsTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t transition_id = 2;
    static constexpr uint32_t arg_set_id = 3;
    static constexpr uint32_t transition_type = 4;
    static constexpr uint32_t send_time_ns = 5;
    static constexpr uint32_t dispatch_time_ns = 6;
    static constexpr uint32_t duration_ns = 7;
    static constexpr uint32_t finish_time_ns = 8;
    static constexpr uint32_t shell_abort_time_ns = 9;
    static constexpr uint32_t handler = 10;
    static constexpr uint32_t status = 11;
    static constexpr uint32_t flags = 12;
    static constexpr uint32_t start_transaction_id = 13;
    static constexpr uint32_t finish_transaction_id = 14;
  };
  struct RowReference {
   public:
    explicit RowReference(WindowManagerShellTransitionsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_);
    }
        std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_);
    }
        std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::handler>(kSpec, row_);
    }
          std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::status>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::flags>(kSpec, row_);
    }
        std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_);
    }
        std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_);
    }
    void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_transition_type(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_, res);
    }
        void set_send_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_, res);
    }
        void set_dispatch_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_, res);
    }
        void set_duration_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_, res);
    }
        void set_finish_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_, res);
    }
        void set_shell_abort_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_, res);
    }
        void set_handler(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::handler>(kSpec, row_, res);
    }
          void set_status(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::status>(kSpec, row_, res_value);
    }
        void set_flags(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::flags>(kSpec, row_, res);
    }
        void set_start_transaction_id(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_, res);
    }
        void set_finish_transaction_id(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WindowManagerShellTransitionsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WindowManagerShellTransitionsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_);
    }
        std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_);
    }
        std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::handler>(kSpec, row_);
    }
          std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::status>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::flags>(kSpec, row_);
    }
        std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_);
    }
        std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WindowManagerShellTransitionsTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::transition_type>(kSpec);
    }
    std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec);
    }
    std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec);
    }
    std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::duration_ns>(kSpec);
    }
    std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec);
    }
    std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec);
    }
    std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::handler>(kSpec);
    }
      std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::status>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::flags>(kSpec);
    }
    std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec);
    }
    std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::transition_type>(kSpec);
    }
    std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec);
    }
    std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec);
    }
    std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::duration_ns>(kSpec);
    }
    std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec);
    }
    std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec);
    }
    std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::handler>(kSpec);
    }
      std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::status>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::flags>(kSpec);
    }
    std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec);
    }
    std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec);
    }
    void set_ts(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::ts>(kSpec, res);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_transition_type(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::transition_type>(kSpec, res);
    }
    void set_send_time_ns(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, res);
    }
    void set_dispatch_time_ns(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, res);
    }
    void set_duration_ns(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::duration_ns>(kSpec, res);
    }
    void set_finish_time_ns(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, res);
    }
    void set_shell_abort_time_ns(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, res);
    }
    void set_handler(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::handler>(kSpec, res);
    }
      void set_status(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::status>(kSpec, res_value);
    }
    void set_flags(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::flags>(kSpec, res);
    }
    void set_start_transaction_id(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, res);
    }
    void set_finish_transaction_id(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WindowManagerShellTransitionsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_);
    }
        std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_);
    }
        std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::handler>(kSpec, row_);
    }
          std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::status>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::flags>(kSpec, row_);
    }
        std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_);
    }
        std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_);
    }
      void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_transition_type(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_, res);
    }
        void set_send_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_, res);
    }
        void set_dispatch_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_, res);
    }
        void set_duration_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_, res);
    }
        void set_finish_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_, res);
    }
        void set_shell_abort_time_ns(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_, res);
    }
        void set_handler(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::handler>(kSpec, row_, res);
    }
          void set_status(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::status>(kSpec, row_, res_value);
    }
        void set_flags(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::flags>(kSpec, row_, res);
    }
        void set_start_transaction_id(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_, res);
    }
        void set_finish_transaction_id(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_, res);
    }

    private:
      WindowManagerShellTransitionsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WindowManagerShellTransitionsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WindowManagerShellTransitionsTable::Id id() const {
        
        return WindowManagerShellTransitionsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> transition_type() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_type>(kSpec, row_);
    }
        std::optional<int64_t> send_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::send_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> dispatch_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dispatch_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> duration_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::duration_ns>(kSpec, row_);
    }
        std::optional<int64_t> finish_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> shell_abort_time_ns() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shell_abort_time_ns>(kSpec, row_);
    }
        std::optional<int64_t> handler() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::handler>(kSpec, row_);
    }
          std::optional<StringPool::Id> status() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::status>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> flags() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::flags>(kSpec, row_);
    }
        std::optional<int64_t> start_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_transaction_id>(kSpec, row_);
    }
        std::optional<int64_t> finish_transaction_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::finish_transaction_id>(kSpec, row_);
    }

    private:
      const WindowManagerShellTransitionsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, int64_t _transition_id = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _transition_type = {}, std::optional<int64_t> _send_time_ns = {}, std::optional<int64_t> _dispatch_time_ns = {}, std::optional<int64_t> _duration_ns = {}, std::optional<int64_t> _finish_time_ns = {}, std::optional<int64_t> _shell_abort_time_ns = {}, std::optional<int64_t> _handler = {}, std::optional<StringPool::Id> _status = {}, std::optional<uint32_t> _flags = {}, std::optional<int64_t> _start_transaction_id = {}, std::optional<int64_t> _finish_transaction_id = {}) : ts(std::move(_ts)), transition_id(std::move(_transition_id)), arg_set_id(std::move(_arg_set_id)), transition_type(std::move(_transition_type)), send_time_ns(std::move(_send_time_ns)), dispatch_time_ns(std::move(_dispatch_time_ns)), duration_ns(std::move(_duration_ns)), finish_time_ns(std::move(_finish_time_ns)), shell_abort_time_ns(std::move(_shell_abort_time_ns)), handler(std::move(_handler)), status(std::move(_status)), flags(std::move(_flags)), start_transaction_id(std::move(_start_transaction_id)), finish_transaction_id(std::move(_finish_transaction_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, transition_id, arg_set_id, transition_type, send_time_ns, dispatch_time_ns, duration_ns, finish_time_ns, shell_abort_time_ns, handler, status, flags, start_transaction_id, finish_transaction_id) ==
             std::tie(other.ts, other.transition_id, other.arg_set_id, other.transition_type, other.send_time_ns, other.dispatch_time_ns, other.duration_ns, other.finish_time_ns, other.shell_abort_time_ns, other.handler, other.status, other.flags, other.start_transaction_id, other.finish_transaction_id);
    }

        int64_t ts;
    int64_t transition_id;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> transition_type;
    std::optional<int64_t> send_time_ns;
    std::optional<int64_t> dispatch_time_ns;
    std::optional<int64_t> duration_ns;
    std::optional<int64_t> finish_time_ns;
    std::optional<int64_t> shell_abort_time_ns;
    std::optional<int64_t> handler;
    std::optional<StringPool::Id> status;
    std::optional<uint32_t> flags;
    std::optional<int64_t> start_transaction_id;
    std::optional<int64_t> finish_transaction_id;
  };

  explicit WindowManagerShellTransitionsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.transition_id, row.arg_set_id, row.transition_type, row.send_time_ns, row.dispatch_time_ns, row.duration_ns, row.finish_time_ns, row.shell_abort_time_ns, row.handler, row.status && row.status != StringPool::Id::Null() ? std::make_optional(*row.status) : std::nullopt, row.flags, row.start_transaction_id, row.finish_transaction_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "window_manager_shell_transitions";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WindowManagerShellTransitionHandlersTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","handler_id","handler_name","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WindowManagerShellTransitionHandlersTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WindowManagerShellTransitionHandlersTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t handler_id = 1;
    static constexpr uint32_t handler_name = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(WindowManagerShellTransitionHandlersTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WindowManagerShellTransitionHandlersTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WindowManagerShellTransitionHandlersTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WindowManagerShellTransitionHandlersTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WindowManagerShellTransitionHandlersTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      WindowManagerShellTransitionHandlersTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WindowManagerShellTransitionHandlersTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WindowManagerShellTransitionHandlersTable::Id id() const {
        
        return WindowManagerShellTransitionHandlersTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const WindowManagerShellTransitionHandlersTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _handler_id = {}, StringPool::Id _handler_name = {}, std::optional<uint32_t> _base64_proto_id = {}) : handler_id(std::move(_handler_id)), handler_name(std::move(_handler_name)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(handler_id, handler_name, base64_proto_id) ==
             std::tie(other.handler_id, other.handler_name, other.base64_proto_id);
    }

        int64_t handler_id;
    StringPool::Id handler_name;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit WindowManagerShellTransitionHandlersTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.handler_id, row.handler_name != StringPool::Id::Null() ? std::make_optional(row.handler_name) : std::nullopt, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "window_manager_shell_transition_handlers";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WindowManagerShellTransitionParticipantsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","transition_id","layer_id","window_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WindowManagerShellTransitionParticipantsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WindowManagerShellTransitionParticipantsTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t transition_id = 1;
    static constexpr uint32_t layer_id = 2;
    static constexpr uint32_t window_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(WindowManagerShellTransitionParticipantsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WindowManagerShellTransitionParticipantsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WindowManagerShellTransitionParticipantsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WindowManagerShellTransitionParticipantsTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WindowManagerShellTransitionParticipantsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      WindowManagerShellTransitionParticipantsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WindowManagerShellTransitionParticipantsTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WindowManagerShellTransitionParticipantsTable::Id id() const {
        
        return WindowManagerShellTransitionParticipantsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const WindowManagerShellTransitionParticipantsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _transition_id = {}, std::optional<uint32_t> _layer_id = {}, std::optional<uint32_t> _window_id = {}) : transition_id(std::move(_transition_id)), layer_id(std::move(_layer_id)), window_id(std::move(_window_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(transition_id, layer_id, window_id) ==
             std::tie(other.transition_id, other.layer_id, other.window_id);
    }

        int64_t transition_id;
    std::optional<uint32_t> layer_id;
    std::optional<uint32_t> window_id;
  };

  explicit WindowManagerShellTransitionParticipantsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.transition_id, row.layer_id, row.window_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_window_manager_shell_transition_participants";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WindowManagerShellTransitionProtosTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","transition_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WindowManagerShellTransitionProtosTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WindowManagerShellTransitionProtosTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t transition_id = 1;
    static constexpr uint32_t base64_proto_id = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(WindowManagerShellTransitionProtosTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t transition_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_transition_id(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WindowManagerShellTransitionProtosTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WindowManagerShellTransitionProtosTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t transition_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WindowManagerShellTransitionProtosTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t transition_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::transition_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t transition_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::transition_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_transition_id(int64_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::transition_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WindowManagerShellTransitionProtosTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t transition_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_transition_id(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      WindowManagerShellTransitionProtosTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WindowManagerShellTransitionProtosTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WindowManagerShellTransitionProtosTable::Id id() const {
        
        return WindowManagerShellTransitionProtosTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t transition_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::transition_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const WindowManagerShellTransitionProtosTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _transition_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : transition_id(std::move(_transition_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(transition_id, base64_proto_id) ==
             std::tie(other.transition_id, other.base64_proto_id);
    }

        int64_t transition_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit WindowManagerShellTransitionProtosTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.transition_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_window_manager_shell_transition_protos";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class WindowManagerTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","arg_set_id","base64_proto_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(WindowManagerTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const WindowManagerTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t arg_set_id = 2;
    static constexpr uint32_t base64_proto_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(WindowManagerTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    WindowManagerTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const WindowManagerTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const WindowManagerTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    std::optional<uint32_t> base64_proto_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }
    void set_base64_proto_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(WindowManagerTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
        void set_base64_proto_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_, res);
    }

    private:
      WindowManagerTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const WindowManagerTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      WindowManagerTable::Id id() const {
        
        return WindowManagerTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> base64_proto_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::base64_proto_id>(kSpec, row_);
    }

    private:
      const WindowManagerTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<uint32_t> _base64_proto_id = {}) : ts(std::move(_ts)), arg_set_id(std::move(_arg_set_id)), base64_proto_id(std::move(_base64_proto_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, arg_set_id, base64_proto_id) ==
             std::tie(other.ts, other.arg_set_id, other.base64_proto_id);
    }

        int64_t ts;
    std::optional<uint32_t> arg_set_id;
    std::optional<uint32_t> base64_proto_id;
  };

  explicit WindowManagerTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.arg_set_id, row.base64_proto_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_windowmanager";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class ProtoLogTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","level","tag","message","stacktrace","location"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(ProtoLogTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ProtoLogTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t level = 2;
    static constexpr uint32_t tag = 3;
    static constexpr uint32_t message = 4;
    static constexpr uint32_t stacktrace = 5;
    static constexpr uint32_t location = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(ProtoLogTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id level() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::level>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id tag() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::tag>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id message() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::message>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id location() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
          void set_level(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::level>(kSpec, row_, res_value);
    }
          void set_tag(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::tag>(kSpec, row_, res_value);
    }
          void set_message(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::message>(kSpec, row_, res_value);
    }
          void set_stacktrace(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_, res_value);
    }
          void set_location(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::location>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ProtoLogTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ProtoLogTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id level() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::level>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id tag() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::tag>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id message() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::message>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id location() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ProtoLogTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id level() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::level>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id tag() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::tag>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id message() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::message>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::stacktrace>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id location() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::location>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id level() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::level>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id tag() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::tag>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id message() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::message>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::stacktrace>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id location() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::location>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    void set_ts(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::ts>(kSpec, res);
    }
      void set_level(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::level>(kSpec, res_value);
    }
      void set_tag(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::tag>(kSpec, res_value);
    }
      void set_message(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::message>(kSpec, res_value);
    }
      void set_stacktrace(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::stacktrace>(kSpec, res_value);
    }
      void set_location(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::location>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ProtoLogTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id level() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::level>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id tag() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::tag>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id message() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::message>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id location() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
          void set_level(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::level>(kSpec, row_, res_value);
    }
          void set_tag(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::tag>(kSpec, row_, res_value);
    }
          void set_message(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::message>(kSpec, row_, res_value);
    }
          void set_stacktrace(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_, res_value);
    }
          void set_location(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::location>(kSpec, row_, res_value);
    }

    private:
      ProtoLogTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ProtoLogTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      ProtoLogTable::Id id() const {
        
        return ProtoLogTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id level() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::level>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id tag() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::tag>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id message() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::message>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id stacktrace() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::stacktrace>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id location() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const ProtoLogTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, StringPool::Id _level = {}, StringPool::Id _tag = {}, StringPool::Id _message = {}, StringPool::Id _stacktrace = {}, StringPool::Id _location = {}) : ts(std::move(_ts)), level(std::move(_level)), tag(std::move(_tag)), message(std::move(_message)), stacktrace(std::move(_stacktrace)), location(std::move(_location)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, level, tag, message, stacktrace, location) ==
             std::tie(other.ts, other.level, other.tag, other.message, other.stacktrace, other.location);
    }

        int64_t ts;
    StringPool::Id level;
    StringPool::Id tag;
    StringPool::Id message;
    StringPool::Id stacktrace;
    StringPool::Id location;
  };

  explicit ProtoLogTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.level != StringPool::Id::Null() ? std::make_optional(row.level) : std::nullopt, row.tag != StringPool::Id::Null() ? std::make_optional(row.tag) : std::nullopt, row.message != StringPool::Id::Null() ? std::make_optional(row.message) : std::nullopt, row.stacktrace != StringPool::Id::Null() ? std::make_optional(row.stacktrace) : std::nullopt, row.location != StringPool::Id::Null() ? std::make_optional(row.location) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "protolog";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_WINSCOPE_TABLES_PY_H_
